import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../../sevices/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const verifyUser = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Add token to Authorization header for subsequent requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('/auth/me'); // An endpoint to get current user
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication check failed', error);
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    setIsAuthenticated(true);
    return response;
  };

  const signup = async (userData) => {
    const response = await api.post('/auth/signup', userData);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
    setIsAuthenticated(true);
    return response;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const authContextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};