import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { authService, notificationService } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  unreadNotifications: number;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (studentData: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('campus_share_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('campus_share_token');
  });
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshNotifications = async () => {
    if (!token) return;
    try {
      const res = await notificationService.getAll();
      if (res.data.success) {
        setUnreadNotifications(res.data.unread_count || 0);
      }
    } catch {
      // ignore in background
    }
  };

  const refreshUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await authService.getMe();
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('campus_share_user', JSON.stringify(res.data.user));
        await refreshNotifications();
      }
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await authService.login({ email, password });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('campus_share_token', receivedToken);
      localStorage.setItem('campus_share_user', JSON.stringify(receivedUser));
      await refreshNotifications();
    } else {
      throw new Error(res.data.message || 'Login failed');
    }
  };

  const register = async (studentData: any) => {
    const res = await authService.register(studentData);
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('campus_share_token', receivedToken);
      localStorage.setItem('campus_share_user', JSON.stringify(receivedUser));
    } else {
      throw new Error(res.data.message || 'Registration failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setUnreadNotifications(0);
    localStorage.removeItem('campus_share_token');
    localStorage.removeItem('campus_share_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'ADMIN',
        unreadNotifications,
        loading,
        login,
        register,
        logout,
        refreshUser,
        refreshNotifications
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
