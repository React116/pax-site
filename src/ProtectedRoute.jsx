import React from 'react';
import { Navigate } from 'react-router-dom';

// JWT payload'ını decode eder (imza doğrulaması olmadan — sadece expiry kontrolü için)
const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // exp: saniye cinsinden Unix timestamp
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const token    = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  if (!token || !userName || !isTokenValid(token)) {
    // Geçersiz veya süresi dolmuş token — temizle
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    return <Navigate to="/giris-yap" replace />;
  }

  return children;
};

export default ProtectedRoute;
