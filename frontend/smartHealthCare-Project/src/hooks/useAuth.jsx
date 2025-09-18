import { useState, useEffect } from 'react';

// Authentication hook with demo functionality
// Will be connected to Replit Auth backend when available
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (userData = { name: 'Healthcare User', email: 'user@healthcare.com' }) => {
    setUser(userData);
    localStorage.setItem('healthcare_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthcare_user');
  };

  useEffect(() => {
    // Check for existing authentication state
    const checkAuth = () => {
      const storedUser = localStorage.getItem('healthcare_user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('healthcare_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for demo authentication events
    const handleDemoLogin = (event) => {
      login(event.detail);
    };

    const handleDemoLogout = () => {
      logout();
    };

    window.addEventListener('demo-login', handleDemoLogin);
    window.addEventListener('demo-logout', handleDemoLogout);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('demo-login', handleDemoLogin);
      window.removeEventListener('demo-logout', handleDemoLogout);
    };
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}