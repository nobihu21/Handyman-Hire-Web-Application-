import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, isAdmin, isHandyman, isCustomer } = useAuth();
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  const hasRequiredRole = roles.length === 0 || roles.some(role => {
    switch (role) {
      case 'admin':
        return isAdmin();
      case 'handyman':
        return isHandyman();
      case 'customer':
        return isCustomer();
      default:
        return false;
    }
  });

  if (!hasRequiredRole) {
    // Redirect to home if user doesn't have required role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 