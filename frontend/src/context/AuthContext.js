import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. Initialize state from localStorage to persist login across page refreshes
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token'));

  // 2. The login function now saves user data and the token to localStorage
  const login = (userData) => {
    if (userData && userData.token) {
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      
      // Update state
      setUser(userData);
      setAuthToken(userData.token);
    }
  };

  // 3. The logout function now clears user data and the token from localStorage
  const logout = () => {
    // Clear from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Update state
    setUser(null);
    setAuthToken(null);
  };

  // ====================== THIS IS THE ADDED FUNCTION ======================
  // This new function handles updating user info without losing the token.
  const updateUser = (newUserData) => {
    // Check if we have new data and an existing token
    if (newUserData && authToken) {
      // Combine the new user data with the existing token
      const updatedUser = { ...newUserData, token: authToken };
      
      // Save the complete, updated object to localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Update the user state
      setUser(updatedUser);
    }
  };
  // =======================================================================


  // 4. The context value now includes the authToken and isLoggedIn is derived from it
  const value = { 
    user, 
    authToken, 
    isLoggedIn: !!authToken, // The most reliable way to check login status
    login, 
    logout,
    updateUser // <-- We've added the new function here
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily use the auth context in any component
export const useAuth = () => {
  return useContext(AuthContext);
};