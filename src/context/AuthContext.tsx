"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { User } from '@/lib/types';
import { postRequest } from '@/lib/api';
import jwt_decode from 'jwt-decode';

interface AuthContextType {
  user: User | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  refetchUser: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      const decoded: any = jwt_decode(storedToken);
      setUser(decoded.user);
      setToken(storedToken);
    }
  }, []);

  const login = async (credentials: any) => {
    try {
      const { accessToken } = await postRequest('http://localhost:3001/auth/login', credentials);
      const decoded: any = jwt_decode(accessToken);
      setUser(decoded.user);
      setToken(accessToken);
      localStorage.setItem('jwt', accessToken);
    } catch (error) {
      console.error('Login failed', error);
      // Handle login error (e.g., show a toast notification)
    }
  };
  
  const refetchUser = async () => {
    // In a real app, you might want to refetch the user from the backend
    // For now, we'll just refetch from the decoded token
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      const decoded: any = jwt_decode(storedToken);
      setUser(decoded.user);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jwt');
    // Redirect to login page or home page
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refetchUser, token }}>
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
