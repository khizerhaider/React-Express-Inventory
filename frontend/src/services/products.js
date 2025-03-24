// src/services/products.js
import api from './api';

export const getAllProducts = async (category = '', minPrice = '', maxPrice = '') => {
    try {
      const response = await fetch(`http://localhost:5000/api/products`);
      const data = await response.json();
  
      console.log("✅ API Response Data:", data); // Debug API response
  
      if (!Array.isArray(data)) {
        console.error("❌ API did not return an array:", data);
        return [];
      }
  
      return data;
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      return [];
    }
  };
  

export const getSellerProducts = async () => {
  try {
    const response = await api.get('/seller/myproducts');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch seller products');
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch product');
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await api.post('/', productData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to add product');
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/${id}`, productData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update product');
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete product');
  }
};