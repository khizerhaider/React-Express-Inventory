// src/components/Products/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import { addProduct, updateProduct } from '../../services/products';
import './Products.css';

const ProductForm = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await addProduct(formData);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
          <input
            type="number"
            id="price"
            name="price"
            min="0.01"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="stock">Stock</label>
          <input
            type="number"
            id="stock"
            name="stock"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;