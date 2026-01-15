import React, { createContext, useState } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/lib/constants';

interface UserData {
  id: string;
  userName: string;
  email: string;
  employeeNumber?: string;
  roles: string[];
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, userData: UserData, rememberMe?: boolean) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(() => {
    const savedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  });

  const login = (newToken: string, userData: UserData, rememberMe: boolean = false) => {
    setToken(newToken);
    setUser(userData);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, newToken);
    storage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
  };

  const isAdmin = user?.roles.some(r => r.toLowerCase() === 'administrator') || false;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};


