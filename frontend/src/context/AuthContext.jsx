import React, { createContext, useState, useEffect, useContext } from 'react';
import { login, register, logout, getCurrentUser } from '../services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  console.log("AuthProvider is rendering...");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Checking for existing user...");
    const storedUser = getCurrentUser();
    console.log("User from storage:", storedUser);
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // ✅ Add handleLogin function
  const handleLogin = async (username, password) => {
    try {
      const userData = await login(username, password);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    }
  };

  // ✅ Add handleRegister function
  const handleRegister = async (username, password) => {
    try {
      return await register(username, password);
    } catch (error) {
      console.error("❌ Registration failed:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login: handleLogin, 
      register: handleRegister, 
      logout: handleLogout,
      isAdmin: user?.role === 'admin',  // ✅ Add isAdmin
      isSeller: user?.role === 'seller' || user?.role === 'admin' // ✅ Add isSeller
    }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
  
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
