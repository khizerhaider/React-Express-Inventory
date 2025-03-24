import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductForm.css';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // If editing, fetch the product data
    if (isEditing) {
      fetchProductData();
    }
  }, [id]);
  
  const fetchProductData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${id}`);
      const product = response.data;
      
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        stock: product.stock
      });
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch product data');
      setLoading(false);
      console.error(err);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Prepare the data
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock)
      };
      
      if (isEditing) {
        // Update existing product
        await axios.put(`/api/products/${id}`, productData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Create new product
        await axios.post('/api/products', productData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      setLoading(false);
      // Redirect back to products list
      navigate('/');
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} product`);
      setLoading(false);
      console.error(err);
    }
  };
  
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="product-form-container">
      <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
      
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
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home</option>
            <option value="Books">Books</option>
            {/* Add more categories as needed */}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="stock">Stock Quantity</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditing ? 'Update Product' : 'Add Product'}
          </button>
          <button 
            type="button" 
            className="cancel-btn" 
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;