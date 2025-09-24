import { useState, useEffect } from 'react';
import api from '../sevices/api'; // Import your API service

// Authentication hook with demo functionality
// Will be connected to Replit Auth backend when available
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Helper to update auth state from API service's stored data
  const updateAuthStateFromApi = () => {
    const currentToken = api.getToken();
    const currentUser = api.getCurrentUser(); // This reads 'user_data' from localStorage

    setToken(currentToken);
    setUser(currentUser);
    setIsLoading(false);
  };

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      // Use the API service's login method
      const response = await api.login(credentials);
      updateAuthStateFromApi(); // Update local state after successful login
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    api.logout(); // Use the API service's logout method
    updateAuthStateFromApi(); // Clear local state after logout
  };

  useEffect(() => {
    // On initial load, check authentication status from the API service
    updateAuthStateFromApi();

    // Optional: Listen for 'storage' events if auth state can change in other tabs/windows
    // const handleStorageChange = () => updateAuthStateFromApi();
    // window.addEventListener('storage', handleStorageChange);
    // return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token, // User is authenticated if both user data and token exist
    login,
    logout,
  };
}