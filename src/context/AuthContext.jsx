'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('celstore_auth_user');
        const savedToken = localStorage.getItem('celstore_auth_token');
        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedToken) setToken(savedToken);
      }
    } catch {
      // fallback
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('celstore_auth_user', JSON.stringify(res.user));
      localStorage.setItem('celstore_auth_token', res.token);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('celstore_auth_user');
    localStorage.removeItem('celstore_auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isSuperAdmin: user?.role === 'superadmin',
        managedStoreId: user?.storeId || null,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
