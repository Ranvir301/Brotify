import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Blocks a page unless the user is logged in (and is an admin, if adminOnly is set)
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={loadingStyle}>Loading Brotify...</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
}

// Styling
const loadingStyle = {
  height: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#0F1E36',
  color: '#9FB3CE',
  fontSize: '1rem',
  fontWeight: '600',
};
