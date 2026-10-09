"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  deviceId: string | null;
  login: (newToken: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        // 1. ตรวจสอบหรือสร้าง Device ID
        let storedDeviceId = localStorage.getItem('deviceId');
        if (!storedDeviceId) {
          storedDeviceId = 'device-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10);
          localStorage.setItem('deviceId', storedDeviceId);
        }
        setDeviceId(storedDeviceId);

        let storedToken = localStorage.getItem('userToken');

        // Auto-login logic for Home Screen Web Apps (standalone)
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const k = params.get('k');
          
          if (k && !storedToken) {
            try {
              const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseKey: k, deviceId: storedDeviceId }),
              });
              if (res.ok) {
                const data = await res.json();
                if (data.token) {
                  storedToken = data.token;
                  localStorage.setItem('userToken', data.token);
                }
              }
            } catch (err) {
              console.error("Auto-login failed:", err);
            }
          }
        }

        if (storedToken) {
          try {
            const verifyRes = await fetch('/api/auth/verify', {
              headers: {
                'Authorization': `Bearer ${storedToken}`
              }
            });
            if (verifyRes.ok) {
              setToken(storedToken);
            } else {
              // Token is invalid, license deleted or suspended
              localStorage.removeItem('userToken');
              setToken(null);
            }
          } catch (err) {
            console.error("Token verification failed (network issue):", err);
            // If network fails, we could either let them in or block them. 
            // Usually, letting them in using the cached token is better for offline PWA support,
            // but for strict license checks, we might want to block or at least log.
            // Let's allow them in if it's just a network failure, they'll be blocked next time they are online.
            setToken(storedToken);
          }
        }
      } catch (error) {
        console.error("Auth context error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('userToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, deviceId, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
