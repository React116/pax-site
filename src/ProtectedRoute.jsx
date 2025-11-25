import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Hafızada kullanıcı adı var mı?
  const isAuthenticated = localStorage.getItem("userName");

  if (!isAuthenticated) {
    // Yoksa Giriş sayfasına postala
    return <Navigate to="/giris-yap" replace />;
  }

  // Varsa sayfayı göster
  return children;
};

export default ProtectedRoute;