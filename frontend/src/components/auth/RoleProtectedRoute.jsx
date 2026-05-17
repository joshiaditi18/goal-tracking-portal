import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';

const RoleProtectedRoute = ({ allowedRoles, redirectTo = '/dashboard' }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
