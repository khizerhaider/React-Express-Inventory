import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import SellerPage from './pages/SellerPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import { AuthProvider } from './context/AuthContext'; // ✅ Import AuthProvider
import { isAuthenticated, getUserRole } from './utils/authUtils';
import { USER_ROLES } from './utils/constants';
import './App.css';

const ProtectedRoute = ({ children, role }) => {
  if (!isAuthenticated()) return <Navigate to="/login" />;
  if (role && getUserRole() !== role) return <Navigate to="/" />;
  return children;
};

const App = () => {
  return (
    <AuthProvider>  {/* ✅ Wrap the entire app inside AuthProvider */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/admin" element={<ProtectedRoute role={USER_ROLES.ADMIN}><AdminPage /></ProtectedRoute>} />
          <Route path="/seller" element={<ProtectedRoute role={USER_ROLES.SELLER}><SellerPage /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </Router>
       {/* ✅ Closing tag */}
    </AuthProvider> 
  );
};

export default App;
