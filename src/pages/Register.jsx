import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { useAuth } from '../context/AuthContext';

const inputStyle = {
  width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10,
  padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none',
};

const labelStyle = { display: 'block', fontSize: 13, color: 'var(--text3)', marginBottom: 8, fontWeight: 500 };

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');

  function update(field) {
    return (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/account/orders', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  }

  return (
    <>
      <PageHeader eyebrow="Join AssetWave" title="Create your" titleItalic="account" />
      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 420 }}>
          <form onSubmit={handleSubmit} style={{
            background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 18, padding: 32,
            display: 'flex', flexDirection: 'column', gap: 18,
          }}>
            <div>
              <label style={labelStyle}>Full name</label>
              <input style={inputStyle} required value={form.full_name} onChange={update('full_name')} placeholder="Jane Doe" />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" required value={form.email} onChange={update('email')} placeholder="you@company.com" />
            </div>
            <div>
              <label style={labelStyle}>Phone (optional)</label>
              <input style={inputStyle} value={form.phone} onChange={update('phone')} placeholder="+1 555 000 0000" />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" required minLength={8} value={form.password} onChange={update('password')} placeholder="At least 8 characters" />
            </div>
            {error && <div style={{ color: 'var(--red)', fontSize: 13 }}>{error}</div>}
            <button type="submit" disabled={loading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
              padding: '13px 20px', borderRadius: 100, fontSize: 14, fontWeight: 600,
              opacity: loading ? 0.6 : 1, cursor: loading ? 'default' : 'pointer',
            }}>
              <UserPlus size={15} /> {loading ? 'Creating account…' : 'Create account'}
            </button>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--violet3)', fontWeight: 500 }}>Log in</Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
