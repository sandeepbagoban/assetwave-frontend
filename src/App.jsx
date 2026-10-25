import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ScrollToTop from './components/shared/ScrollToTop';
import ProtectedRoute from './components/shared/ProtectedRoute';
import CookieBanner from './components/shared/CookieBanner';

import Home from './pages/Home';
import About from './pages/About';
import FeaturesPage from './pages/FeaturesPage';
import Marketplace from './pages/Marketplace';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderDetail from './pages/OrderDetail';
import OrderHistory from './pages/account/OrderHistory';
import SellerDashboard from './pages/account/SellerDashboard';
import TermsOfUse from './pages/legal/TermsOfUse';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/impact" element={<Navigate to="/about" replace />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<ProductDetail />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ambassador" element={<Navigate to="/contact" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<ProtectedRoute pilot><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute pilot><Checkout /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
        <Route path="/account/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/account/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
      <Footer />
      <CookieBanner />
    </>
  );
}
