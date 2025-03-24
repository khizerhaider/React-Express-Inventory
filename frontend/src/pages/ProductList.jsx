import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
  // Get user data from local storage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = user.role === 'admin';
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
      console.error(err);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Filter products by search term locally
    // For more complex searches, you might want to use the API with query params
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setProducts(filtered);
    
    // If search term is cleared, fetch all products again
    if (!searchTerm) {
      fetchProducts();
    }
  };
  
  const handleCategoryFilter = async (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    
    try {
      setLoading(true);
      let url = '/api/products';
      
      if (selectedCategory) {
        url += `?category=${selectedCategory}`;
      }
      
      const response = await axios.get(url);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to filter products');
      setLoading(false);
      console.error(err);
    }
  };
  
  const handlePriceFilter = async () => {
    if (!minPrice && !maxPrice) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/products?minPrice=${minPrice}&maxPrice=${maxPrice}`);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to filter products by price');
      setLoading(false);
      console.error(err);
    }
  };
  
  const handleDelete = async (productId) => {
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
      
      // Refresh product list after deletion
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };
  
  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="product-list-container">
      <h2>Product Catalog</h2>
      
      <div className="filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        
        <div className="filter-controls">
          <div className="category-filter">
            <label>Category:</label>
            <select value={category} onChange={handleCategoryFilter}>
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home</option>
              <option value="Books">Books</option>
              {/* Add more categories as needed */}
            </select>
          </div>
          
          <div className="price-filter">
            <label>Price Range:</label>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="price-input"
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="price-input"
            />
            <button onClick={handlePriceFilter} className="filter-button">Apply</button>
          </div>
        </div>
      </div>
      
      {isAdmin && (
        <div className="admin-controls">
          <Link to="/admin/add-product" className="add-product-btn">
            Add New Product
          </Link>
        </div>
      )}
      
      {products.length === 0 ? (
        <div className="no-products">No products found</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {/* Placeholder for product image */}
                <div className="placeholder-image">Product Image</div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">${product.price}</p>
                <p className="category">Category: {product.category}</p>
                <p className="stock">In Stock: {product.stock}</p>
                
                <div className="product-actions">
                  <Link to={`/products/${product.id}`} className="view-btn">
                    View Details
                  </Link>
                  
                  {(isAdmin || user.id === product.seller_id) && (
                    <>
                      <Link to={`/products/edit/${product.id}`} className="edit-btn">
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)} 
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;