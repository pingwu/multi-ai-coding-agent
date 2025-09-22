import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Reuse the same API base URL logic as apiService
const resolveBaseUrl = () => {
  try {
    if (typeof window !== 'undefined' && window.location) {
      return 'http://localhost:8000';
    }
  } catch {}
  return process.env.REACT_APP_API_URL || '';
};
const API_BASE_URL = resolveBaseUrl();

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      console.log('DEBUG: Checking auth at:', `${API_BASE_URL}/auth/status`);
      const response = await fetch(`${API_BASE_URL}/auth/status`, {
        credentials: 'include',
      });
      console.log('DEBUG: Auth response status:', response.status);
      console.log('DEBUG: Auth response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('DEBUG: Auth response data:', data);
        setIsAuthenticated(data.authenticated);
        setUser(data.user ?? null);
      } else {
        console.log('DEBUG: Auth response not ok, setting to false');
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();

    // Check if we just returned from OAuth (detect by checking if this is root and no auth yet)
    const checkOAuthReturn = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const path = window.location.pathname;

      // If we're on the root path and it's been more than 100ms since load, re-check auth
      if (path === '/' && !isAuthenticated) {
        setTimeout(() => {
          checkAuth();
        }, 100);
      }
    };

    checkOAuthReturn();
  }, []);

  // Re-check auth when user navigates back from OAuth
  useEffect(() => {
    const handleFocus = () => {
      checkAuth();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuth();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, checkAuth }}>
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
