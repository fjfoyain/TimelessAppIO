

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { User } from '../types';

interface ProtectedRouteProps {
  user: User | null;
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children, adminOnly = false }) => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;