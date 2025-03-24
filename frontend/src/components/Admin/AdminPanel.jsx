// src/components/Admin/AdminPanel.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProductsList from '../Products/ProductsList';
import './Admin.css';

const AdminPanel = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>
      <p className="admin-intro">Manage all products in the inventory system</p>
      
      <ProductsList showAddButton={true} />
    </div>
  );
};

export default AdminPanel;