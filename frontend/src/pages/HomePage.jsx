// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import ProductsList from '../components/Products/ProductsList';
import ProductSearch from '../components/Products/ProductSearch';
import { getAllProducts } from '../services/products';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (filteredData) => {
    setFilteredProducts(filteredData);
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-page">
      <h1>Product Inventory</h1>
      <ProductSearch products={products} onSearch={handleSearch} />
      <ProductsList products={filteredProducts} />
    </div>
  );
};

export default HomePage;
