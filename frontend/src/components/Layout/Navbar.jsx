// src/components/Layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

const Navbar = () => {
  const { user, logout, isAdmin, isSeller, loading } = useAuth();

  
  const navigate = useNavigate();
  if (loading) return null; // Don't render Navbar until AuthProvider is initialized
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">E-Commerce Inventory</Link>
      </div>
      <div className="navbar-menu">
        {user ? (
          <>
            <Link to="/" className="nav-item">Home</Link>
            {isAdmin && <Link to="/admin" className="nav-item">Admin Panel</Link>}
            {isSeller && !isAdmin && <Link to="/seller" className="nav-item">My Products</Link>}
            <span className="nav-item user-info">Welcome, {user.username}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item">Login</Link>
            <Link to="/register" className="nav-item">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;