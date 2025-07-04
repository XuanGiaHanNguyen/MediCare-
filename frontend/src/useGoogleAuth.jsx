import { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';

// Create context for Google auth state
const GoogleAuthContext = createContext();

// Provider component
export function GoogleAuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/auth/status`, {
        withCredentials: true
      });
      
      if (response.data.authenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`http://localhost:3000/auth/logout`, {}, {
        withCredentials: true
      });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    checkAuthStatus,
    logout
  };

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
}

// Hook to use Google auth
export function useGoogleAuth() {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
  }
  return context;
}

// Individual hook for component use
export function useGoogleAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3000/auth/status`, {
        withCredentials: true
      });
      
      if (response.data.authenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`http://localhost:3000/auth/logout`, {}, {
        withCredentials: true
      });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    checkAuthStatus,
    logout
  };
}