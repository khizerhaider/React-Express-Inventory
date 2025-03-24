// src/components/Products/ProductSearch.jsx
import React, { useState } from 'react';
import './Products.css';

const ProductSearch = ({ onSearch }) => {
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ category, minPrice, maxPrice });
  };

  const handleReset = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    onSearch({ category: '', minPrice: '', maxPrice: '' });
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-inputs">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Filter by category"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="minPrice">Min Price</label>
            <input
              type="number"
              id="minPrice"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min price"
              min="0"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price"
              min="0"
            />
          </div>
        </div>
        
        <div className="search-actions">
          <button type="submit" className="btn-search">Search</button>
          <button type="button" className="btn-reset" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default ProductSearch;