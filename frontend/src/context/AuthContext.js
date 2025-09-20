// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token'));

  // Login function
  const login = (userData) => {
    if (userData && userData.token) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      setUser(userData); // This is crucial to update context state
      setAuthToken(userData.token);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null); // Reset state to null
    setAuthToken(null);
  };

  // updateUser function (already looks good)
  const updateUser = (newUserData) => {
    if (newUserData && authToken) {
      const updatedUser = { ...newUserData, token: authToken };
      localStorage.setItem('user', JSON.JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  // Context value
  const value = {
    user,
    authToken,
    isLoggedIn: !!authToken,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};