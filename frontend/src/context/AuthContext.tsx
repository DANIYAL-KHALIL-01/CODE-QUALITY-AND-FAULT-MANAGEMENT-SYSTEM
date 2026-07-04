/**
 * Authentication Context
 * Manages user authentication state across the application
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../lib/api';
import { toast } from 'sonner';

interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  organization?: string;
  created_at: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string, fullName?: string, organization?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface CurrentUserResponse {
  user: User;
}

interface LoginSignupResponse {
  message: string;
  user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await api.getCurrentUser() as any;
      if (response.data && (response.data as CurrentUserResponse).user) {
        setUser((response.data as CurrentUserResponse).user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login(username, password) as any;
      
      if (response.error) {
        toast.error(response.error);
        return false;
      }
      
      if (response.data && (response.data as LoginSignupResponse).user) {
        setUser((response.data as LoginSignupResponse).user);
        toast.success('Login successful!');
        return true;
      }
      
      return true;
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string,
    fullName?: string,
    organization?: string
  ): Promise<boolean> => {
    try {
      const response = await api.signup(username, email, password, fullName, organization) as any;
      
      if (response.error) {
        toast.error(response.error);
        return false;
      }
      
      if (response.data && (response.data as LoginSignupResponse).user) {
        setUser((response.data as LoginSignupResponse).user);
        toast.success('Account created successfully!');
        return true;
      }
      
      return false;
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, checkAuth }}>
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