import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Mengambil state 'user' dari context

  if (!user) {
    // Jika tidak ada user, redirect ke halaman login
    return <Navigate to="/login" replace />;
  }

  return children; // Jika 'user' ada isinya, izinkan akses
};

export default ProtectedRoute;