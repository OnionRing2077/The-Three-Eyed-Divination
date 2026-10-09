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
    const loadAuth = () => {
      try {
        // 1. ตรวจสอบหรือสร้าง Device ID
        let storedDeviceId = localStorage.getItem('deviceId');
        if (!storedDeviceId) {
          storedDeviceId = 'device-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10);
          localStorage.setItem('deviceId', storedDeviceId);
        }
        setDeviceId(storedDeviceId);

        // 2. โหลด Token เก่าถ้ามี
        const storedToken = localStorage.getItem('userToken');
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
