// src/components/Products/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Products.css';

const ProductCard = ({ product, onDelete, onEdit }) => {
  const { isAdmin, isSeller, user } = useAuth();
  const canManage = isAdmin || (isSeller && user.id === product.seller_id);

  return (
    <div className="product-card">
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
        <p className="product-category">Category: {product.category}</p>
        <p className="product-stock">
          Stock: <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
            {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
          </span>
        </p>
      </div>
      <div className="product-actions">
        <Link to={`/product/${product.id}`} className="btn-view">View Details</Link>
        
        {canManage && (
          <>
            <button onClick={() => onEdit(product)} className="btn-edit">Edit</button>
            <button onClick={() => onDelete(product.id)} className="btn-delete">Delete</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;