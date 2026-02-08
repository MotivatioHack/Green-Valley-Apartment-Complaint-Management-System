import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRole?: 'USER' | 'ADMIN';
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // 1. If no token, kick them back to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. If a specific role is required and doesn't match, kick them to their own dashboard
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={userRole === 'ADMIN' ? "/admin/dashboard" : "/user/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
