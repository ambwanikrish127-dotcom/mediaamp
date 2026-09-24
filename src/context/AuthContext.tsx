import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    const saved = localStorage.getItem('cinebook_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('cinebook_jwt_token');
  });
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return localStorage.getItem('cinebook_city') || 'Mumbai';
  });

  const handleSetCity = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem('cinebook_city', city);
  };

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(res => {
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('cinebook_user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          // Token expired or invalid
          logout();
        });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: jwtToken, user: authUser } = res.data;
        setToken(jwtToken);
        setUser(authUser);
        localStorage.setItem('cinebook_jwt_token', jwtToken);
        localStorage.setItem('cinebook_user', JSON.stringify(authUser));
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please verify credentials.'
      };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data.success) {
        const { token: jwtToken, user: authUser } = res.data;
        setToken(jwtToken);
        setUser(authUser);
        localStorage.setItem('cinebook_jwt_token', jwtToken);
        localStorage.setItem('cinebook_user', JSON.stringify(authUser));
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cinebook_jwt_token');
    localStorage.removeItem('cinebook_user');
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    selectedCity,
    setSelectedCity: handleSetCity,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
