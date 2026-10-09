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
                storedToken = data.token;
                localStorage.setItem('userToken', storedToken);
              }
            } catch (err) {
              console.error("Auto-login failed:", err);
            }
          }
        }

        if (storedToken) setToken(storedToken);
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
