import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthResponse, LoginData, SignupData } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthResponse | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const login = useCallback(async (data: LoginData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response));
      setUser(response);
      setIsAuthenticated(true);
    } catch (err: any) {
      const message = err.response?.data?.message || '로그인에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.signup(data);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response));
      setUser(response);
      setIsAuthenticated(true);
    } catch (err: any) {
      const message = err.response?.data?.message || '회원가입에 실패했습니다';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
