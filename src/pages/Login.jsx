import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
  width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10,
  padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none',
};

const labelStyle = { display: 'block', fontSize: 13, color: 'var(--text3)', marginBottom: 8, fontWeight: 500 };

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const redirectTo = location.state?.from || '/account/orders';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
  }

  return (
    <>
      <PageHeader eyebrow="Welcome back" title="Log in to" titleItalic="AssetWave" />
      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 420 }}>
          <form onSubmit={handleSubmit} style={{
            background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 18, padding: 32,
            display: 'flex', flexDirection: 'column', gap: 18,
          }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {error && <div style={{ color: 'var(--red)', fontSize: 13 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
              padding: '13px 20px', borderRadius: 100, fontSize: 14, fontWeight: 600,
              opacity: loading ? 0.6 : 1, cursor: loading ? 'default' : 'pointer',
            }}>
              <LogIn size={15} /> {loading ? 'Logging in…' : 'Log in'}
            </button>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--violet3)', fontWeight: 500 }}>Create one</Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
