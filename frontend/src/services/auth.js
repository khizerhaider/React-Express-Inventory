// src/services/auth.js
import api from './api';
import { jwtDecode } from 'jwt-decode';


export const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', { username, password }); // ✅ Ensure `/api/auth/login`
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Login failed');
    }
};
  
export const register = async (username, password) => {
    try {
      const response = await api.post('/api/auth/register', { username, password }); // ✅ Ensure `/api/auth/register`
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Registration failed');
    }
};
  

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      return jwtDecode(token);
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

export const isSeller = () => {
  const user = getCurrentUser();
  return user && (user.role === 'seller' || user.role === 'admin');
};

