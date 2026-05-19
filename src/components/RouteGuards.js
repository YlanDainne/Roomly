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

/**
 * AdminRoute - Protects admin-only routes by verifying user has admin role.
 * Redirects to dashboard if user is not an admin.
 */
export const AdminRoute = () => {
  const location = useLocation();
  const { loading, session } = useAuth();
  const [userRole, setUserRole] = React.useState(null);
  const [checkingRole, setCheckingRole] = React.useState(true);

  React.useEffect(() => {
    if (loading) return;

    if (!session) {
      setCheckingRole(false);
      return;
    }

    // Fetch user profile to check role
    const fetchUserRole = async () => {
      try {
        const { rentalApi } = await import('../services/rentalApi');
        const userProfile = await rentalApi.getMe();
        setUserRole(userProfile?.role);
      } catch (err) {
        console.error('Failed to fetch user role:', err);
        setUserRole(null);
      } finally {
        setCheckingRole(false);
      }
    };

    fetchUserRole();
  }, [loading, session]);

  if (loading || checkingRole) {
    return <div className="route-gate">Verifying admin access...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
