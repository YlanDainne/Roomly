import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RequireAuth = () => {
  const location = useLocation();
  const { loading, session } = useAuth();

  if (loading) {
    return <div className="route-gate">Checking your session...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const { loading, session } = useAuth();

  if (loading) {
    return <div className="route-gate">Checking your session...</div>;
  }

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
