import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/shared/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { inputStyle, labelStyle } from '../components/shared/ui/styles';
import { loginDestination } from '../lib/accountNavigation';

const REASON_MESSAGES = {
  cart: 'Log in to view your cart.',
  checkout: 'Log in to complete your purchase.',
  orders: 'Log in to view your orders.',
  seller: 'Log in to access your seller dashboard.',
  buy: 'Log in to buy this item.',
  'add-to-cart': 'Log in to add this item to your cart.',
};

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const contextMessage = REASON_MESSAGES[location.state?.reason];

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const account = await login(email, password);
      navigate(loginDestination(account, location.state?.from), { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
  }

  return (
    <AuthLayout title="Welcome back." description="Sign in to manage your inventory, track orders and continue your conversations with AWXchange.">
          {contextMessage && <p className="form-notice">{contextMessage}</p>}
          <form onSubmit={handleSubmit} className="aw-surface" style={{
            borderRadius: 18, padding: 32,
            display: 'flex', flexDirection: 'column', gap: 18,
          }}>
            <div>
              <label htmlFor="field-email" style={labelStyle}>Email</label>
              <input id="field-email" style={inputStyle} type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div>
              <label htmlFor="field-password" style={labelStyle}>Password</label>
              <div className="password-field"><input id="field-password" style={inputStyle} type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div>
            </div>
            {error && <div role="alert" style={{ color: 'var(--red)', fontSize: 13 }}>{error}</div>}
            <button type="submit" disabled={loading} className="aw-btn" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
              padding: '13px 20px', borderRadius: 100, fontSize: 14, fontWeight: 600,
              opacity: loading ? 0.6 : 1, cursor: loading ? 'default' : 'pointer',
            }}>
              <LogIn size={15} /> {loading ? 'Logging in…' : 'Log in'}
            </button>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
              Don't have an account? <Link to="/register" state={location.state} style={{ color: 'var(--violet3)', fontWeight: 500 }}>Create one</Link>
            </div>
          </form>
    </AuthLayout>
  );
}
