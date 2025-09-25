import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../../sevices/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New function to sync AuthContext state with localStorage using api.js helpers
  // This replaces the old, broken `verifyUser` async function.
  const refreshUser = useCallback(() => {
    // Use the globally consistent logic from api.js to check authentication status
    const currentUser = api.getCurrentUser();
    const authenticated = api.isAuthenticated();

    if (authenticated && currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    } else {
      // If unauthenticated or token is invalid, clear stale data
      setUser(null);
      setIsAuthenticated(false);
      // We rely on api.logout() to clear the correct keys if needed, 
      // but only perform the clear action in a single place (the public logout function).
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Initial load check, using the correct retrieval logic
    refreshUser();

    // Event listener for manual logout button on Home page
    const handleDemoLogout = () => {
      logout();
    };
    window.addEventListener('demo-logout', handleDemoLogout);
    return () => window.removeEventListener('demo-logout', handleDemoLogout);
  }, [refreshUser]);

  // The login and signup functions were redundant/incorrectly implemented in the original file.
  // Since Auth.jsx calls api.js directly to set auth state, 
  // we expose a simple logout and refresh function to manage the context state.

  const login = async (credentials) => {
    // Rely on api.login to handle successful authentication and local storage saving.
    const response = await api.login(credentials);
    refreshUser(); // Update context state immediately after successful login
    return response;
  };

  const signup = async (userData) => {
    const response = await api.register(userData);
    // In a real flow, registration is followed by login or redirection to login.
    // We update context state in case api.register also returns tokens.
    refreshUser();
    return response;
  }

  const logout = () => {
    api.logout(); // Clear localStorage keys
    refreshUser(); // Sync context state to null/false
  };

  const authContextValue = {
    user,
    isAuthenticated,
    isLoading,
    logout,
    login,
    signup,
    refreshUser, // Expose to let components trigger an update after direct API calls
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};