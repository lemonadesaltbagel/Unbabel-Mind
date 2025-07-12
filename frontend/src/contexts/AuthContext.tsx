'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '@/utils/api';
import type { User } from '@/types';
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authAPI.getProfile();
          setUser(userData);
        }
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);
  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    localStorage.setItem('token', response.token);
    setUser(response.user);
  };
  const register = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    const response = await authAPI.register(data);
    localStorage.setItem('token', response.token);
    setUser(response.user);
  };
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}; 