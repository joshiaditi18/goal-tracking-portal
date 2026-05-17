import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext.jsx';

const ProtectedRoute = ({ redirectTo = '/login' }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
