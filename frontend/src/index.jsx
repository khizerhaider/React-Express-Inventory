import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom'; // ✅ Ensure this is present
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>  {/* ✅ Ensure Router wraps the App */}
      <AuthProvider>  {/* ✅ Ensure AuthProvider wraps App */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
