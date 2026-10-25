import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const REASON_BY_PREFIX = [
  ['/checkout', 'checkout'],
  ['/cart', 'cart'],
  ['/account/seller', 'seller'],
  ['/account/orders', 'orders'],
  ['/orders/', 'orders'],
];

export default function ProtectedRoute({ children, pilot = false }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    const reason = REASON_BY_PREFIX.find(([prefix]) => location.pathname.startsWith(prefix))?.[1];
    return <Navigate to="/login" state={{ from: location.pathname, reason }} replace />;
  }
  if (pilot && !user.pilot_buyer && user.role !== 'admin') return <Navigate to="/contact" replace />;
  return children;
}
