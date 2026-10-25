import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const REASON_BY_PREFIX = [
  ['/checkout', 'checkout'],
  ['/cart', 'cart'],
  ['/account/seller', 'seller'],
  ['/account/orders', 'orders'],
  ['/orders/', 'orders'],
];

export default function ProtectedRoute({ children, pilot = false, seller = false }) {
  const { user, sellerProfile, sellerProfileLoading } = useAuth();
  const location = useLocation();

  if (!user) {
    const reason = REASON_BY_PREFIX.find(([prefix]) => location.pathname.startsWith(prefix))?.[1];
    return <Navigate to="/login" state={{ from: location.pathname, reason }} replace />;
  }
  if (seller && sellerProfileLoading) return <p role="status" className="container">Loading your account…</p>;
  if (seller && user.role !== 'seller' && !sellerProfile) return <Navigate to="/account/orders" replace />;
  if (pilot && !user.pilot_buyer && user.role !== 'admin') return <Navigate to="/contact" replace />;
  return children;
}
