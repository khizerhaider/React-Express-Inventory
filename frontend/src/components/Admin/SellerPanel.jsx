// src/components/Admin/SellerPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSellerProducts, deleteProduct } from '../../services/products';
import ProductCard from '../Products/ProductCard';
import ProductForm from '../Products/ProductForm';
import './Admin.css';

const SellerPanel = () => {
  const { isSeller, loading, user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isSeller) {
      navigate('/');
    }
  }, [isSeller, loading, navigate]);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const data = await getSellerProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load your products');
      } finally {
        setLoadingProducts(false);
      }
    };

    if (isSeller) {
      fetchSellerProducts();
    }
  }, [isSeller]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        setError('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleFormClose = async () => {
    setShowForm(false);
    setEditProduct(null);
    
    // Refresh products
    try {
      setLoadingProducts(true);
      const data = await getSellerProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to refresh products');
    } finally {
      setLoadingProducts(false);
    }
  };

  if (loading || loadingProducts) return <div className="loading">Loading...</div>;
  if (!isSeller) return null;

  return (
    <div className="seller-panel">
      <h1>Seller Dashboard</h1>
      {error && <p className="error-message">{error}</p>}
      <button onClick={() => setShowForm(true)} className="add-product-btn">Add Product</button>
      {showForm && <ProductForm onClose={handleFormClose} product={editProduct} />}
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default SellerPanel;
