// src/components/Products/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../services/products';
import { useAuth } from '../../context/AuthContext';
import './Products.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isSeller, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  const canManage = isAdmin || (isSeller && user.id === product.seller_id);

  return (
    <div className="product-details-container">
      <div className="product-details-card">
        <h2>{product.name}</h2>
        
        <div className="product-details-info">
          <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p>
            <strong>Availability:</strong> 
            <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </p>
          {product.seller_id && (
            <p><strong>Seller ID:</strong> {product.seller_id}</p>
          )}
        </div>
        
        <div className="product-details-actions">
          <button onClick={() => navigate(-1)} className="btn-back">
            Back to Products
          </button>
          
          {canManage && (
            <div className="management-buttons">
              <button 
                onClick={() => navigate(`/admin/edit/${product.id}`)} 
                className="btn-edit"
              >
                Edit Product
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;