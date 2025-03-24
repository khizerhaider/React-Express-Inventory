import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  
  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      window.location.href = '/'; // Redirect non-admin users
      return;
    }
    
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch products
      const productsResponse = await axios.get('/api/products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Fetch users (admin only endpoint)
      const usersResponse = await axios.get('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setProducts(productsResponse.data);
      setUsers(usersResponse.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      console.error(err);
    }
  };
  
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update products list
      setProducts(products.filter(product => product.id !== productId));
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };
  
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/users/${userId}/role`, { role: newRole }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update users list with new role
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      setError('Failed to update user role');
      console.error(err);
    }
  };
  
  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>
      
      {activeTab === 'products' && (
        <div className="products-management">
          <div className="top-controls">
            <h3>Product Management</h3>
            <Link to="/admin/add-product" className="add-btn">Add New Product</Link>
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Seller</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>{product.seller_id}</td>
                  <td className="action-buttons">
                    <Link to={`/products/${product.id}`} className="view-btn">View</Link>
                    <Link to={`/products/edit/${product.id}`} className="edit-btn">Edit</Link>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)} 
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {activeTab === 'users' && (
        <div className="users-management">
          <h3>User Management</h3>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td className="action-buttons">
                    {user.role === 'admin' ? (
                      <button 
                        onClick={() => handleUpdateUserRole(user.id, 'user')} 
                        className="role-btn"
                      >
                        Make User
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUpdateUserRole(user.id, 'admin')} 
                        className="role-btn admin"
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;