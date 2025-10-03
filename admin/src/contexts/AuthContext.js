import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  // API base URL - can be configured via environment variables
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const validateToken = async () => {
    try {
      // Handle dummy token
      if (token && token.startsWith('dummy-admin-token-')) {
        const dummyUser = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@donatetrack.com',
          role: 'admin'
        };
        setUser(dummyUser);
        setLoading(false);
        return;
      }

      // Validate real token with API
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.user && userData.user.role === 'admin') {
          setUser(userData.user);
        } else {
          // User is not admin, clear token
          logout();
        }
      } else {
        // Token is invalid
        logout();
      }
    } catch (error) {
      console.error('Token validation error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Dummy authentication for admin panel
      const dummyCredentials = {
        email: 'admin@donatetrack.com',
        password: 'admin123'
      };

      // Check dummy credentials first
      if (email === dummyCredentials.email && password === dummyCredentials.password) {
        const dummyUser = {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@donatetrack.com',
          role: 'admin'
        };
        const dummyToken = 'dummy-admin-token-' + Date.now();

        setUser(dummyUser);
        setToken(dummyToken);
        localStorage.setItem('adminToken', dummyToken);
        return { success: true };
      }

      // Try actual API if dummy credentials don't match
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if user is admin
        if (data.user.role !== 'admin') {
          throw new Error('Access denied. Admin privileges required.');
        }

        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        return { success: true };
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      // If it's a network error and not a credential error, show helpful message
      if (error.message.includes('fetch')) {
        return { 
          success: false, 
          error: 'Cannot connect to server. Use dummy credentials: admin@donatetrack.com / admin123' 
        };
      }
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    API_BASE_URL
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};