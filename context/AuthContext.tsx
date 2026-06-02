import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiBaseUrl } from '../config';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'FARMER';
  avatar?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('agrivision_token');
      if (storedToken) {
        try {
          const API_BASE_URL = getApiBaseUrl();
          const res = await fetch(`${API_BASE_URL}/auth/verify`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          const data = await res.json();
          if (res.ok && data.valid) {
            console.log("[AUTH] Verification success", data.user);
            setToken(storedToken);
            setUser(data.user);
          } else {
            console.warn("[AUTH] Verification failed", data);
            localStorage.removeItem('agrivision_token');
          }
        } catch (error) {
          console.error("Auth verification failed", error);
          localStorage.removeItem('agrivision_token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, userData: User) => {
    localStorage.setItem('agrivision_token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    const storedToken = localStorage.getItem('agrivision_token');
    
    // Clear local state immediately for responsive UI
    localStorage.removeItem('agrivision_token');
    localStorage.removeItem('agrivision_current_page');
    localStorage.removeItem('agrivision_nav_params');
    localStorage.removeItem('agrivision_selected_farm');
    setToken(null);
    setUser(null);

    if (storedToken) {
      try {
        const API_BASE_URL = getApiBaseUrl();
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${storedToken}` }
        });
      } catch (error) {
        console.error("Logout API call failed", error);
      }
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading }}>
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
