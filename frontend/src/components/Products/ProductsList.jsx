// src/components/Products/ProductsList.jsx
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductSearch from './ProductSearch';
import ProductForm from './ProductForm';
import { getAllProducts, deleteProduct } from '../../services/products';
import './Products.css';

const ProductsList = ({ sellerOnly = false, showAddButton = false }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts(filters.category, filters.minPrice, filters.maxPrice);
      
      console.log("✅ Products Fetched:", data); // Debugging API response
  
      setProducts(Array.isArray(data) ? data : []); // ✅ Ensure it's always an array
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error("❌ Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        setError('Failed to delete product');
        console.error(err);
      }
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditProduct(null);
    fetchProducts();
  };

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Products</h2>
        {showAddButton && (
          <button onClick={() => setShowForm(true)} className="btn-add">
            Add New Product
          </button>
        )}
      </div>

      <ProductSearch onSearch={handleSearch} />

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProductForm 
              product={editProduct} 
              onClose={handleFormClose} 
            />
          </div>
        </div>
      )}

      {Array.isArray(products) && products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-grid">
          {Array.isArray(products) ? (
            products.map(product => (
              <ProductCard
          key={product.id}
          product={product}
          onDelete={handleDelete}
          onEdit={handleEdit}
              />
            ))
          ) : (
            <p>Error: Products data is not an array.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsList;