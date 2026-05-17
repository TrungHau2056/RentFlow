import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sync status if modified in another tab or in axios interceptor
    const handleLogoutEvent = () => {
      setIsAuthenticated(false);
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    
    // Check if tokens are present on mount
    setIsAuthenticated(authService.isAuthenticated());

    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const responseData = await authService.login(email, password);
      // Let's assume standard response code like 200 or 201 indicates success, 
      // or if status exists inside the response data it should not be an error (like 400, 401, 500).
      if (responseData && (responseData.status === 200 || !responseData.status)) {
        setIsAuthenticated(true);
        return { success: true, message: responseData.message || 'Login successful' };
      } else {
        return { 
          success: false, 
          message: responseData?.message || 'Login failed with status ' + responseData?.status 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
