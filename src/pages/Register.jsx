import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { UserPlus, ShoppingBag, Store } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { useAuth } from '../context/AuthContext';
import { applyAsSeller } from '../lib/api/sellers';
import { inputStyle, labelStyle } from '../components/shared/ui/styles';

export default function Register() {
  const { register, loading, refreshSellerProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [intent, setIntent] = useState(location.state?.intent === 'seller' ? 'seller' : 'buyer');
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [sellerForm, setSellerForm] = useState({ org_name: '', country: '', account_type: 'organization', registration_no: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  }
  function updateSeller(field) {
    return (e) => setSellerForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
    } catch (err) {
      setSubmitting(false);
      setError(err.message || 'Registration failed.');
      return;
    }

    if (intent === 'seller') {
      // Account creation succeeded regardless of what happens next — if the
      // apply call fails, sellerProfile stays null and the dashboard's own
      // "Become a seller" form re-appears there for a direct retry.
      try {
        await applyAsSeller(sellerForm);
      } catch { /* handled by the dashboard's retry form */ }
      await refreshSellerProfile();
      navigate('/account/seller', { replace: true });
    } else {
      navigate(location.state?.from || '/', { replace: true });
    }
  }

  const busy = loading || submitting;

  return (
    <>
      <PageHeader eyebrow="Join AssetWave" title="Create your" titleItalic="account" />
      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 460 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
            {[
              { id: 'buyer', label: 'Buy equipment', icon: ShoppingBag },
              { id: 'seller', label: 'Sell equipment', icon: Store },
            ].map(t => (
              <button key={t.id} type="button" onClick={() => setIntent(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 100, fontSize: 13.5, fontWeight: 500,
                border: '1px solid ' + (intent === t.id ? 'var(--violet)' : 'var(--border)'),
                background: intent === t.id ? 'var(--surface3)' : 'transparent',
                color: intent === t.id ? 'var(--text)' : 'var(--text3)',
              }}><t.icon size={14} /> {t.label}</button>
            ))}
          </div>

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

            {intent === 'seller' && (
              <>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  Seller details
                </div>
                <div>
                  <label style={labelStyle}>Organization / business name</label>
                  <input style={inputStyle} required value={sellerForm.org_name} onChange={updateSeller('org_name')} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Country (2-letter code)</label>
                    <input style={inputStyle} required maxLength={2} value={sellerForm.country} onChange={e => setSellerForm(f => ({ ...f, country: e.target.value.toUpperCase() }))} />
                  </div>
                  <div>
                    <label style={labelStyle}>Account type</label>
                    <select style={inputStyle} value={sellerForm.account_type} onChange={updateSeller('account_type')}>
                      <option value="organization">Organization</option>
                      <option value="individual">Individual</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Registration number (optional)</label>
                  <input style={inputStyle} value={sellerForm.registration_no} onChange={updateSeller('registration_no')} />
                </div>
              </>
            )}

            {error && <div style={{ color: 'var(--red)', fontSize: 13 }}>{error}</div>}

            <button type="submit" disabled={busy} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
              padding: '13px 20px', borderRadius: 100, fontSize: 14, fontWeight: 600,
              opacity: busy ? 0.6 : 1, cursor: busy ? 'default' : 'pointer',
            }}>
              <UserPlus size={15} /> {busy ? 'Creating account…' : intent === 'seller' ? 'Create account & apply to sell' : 'Create account'}
            </button>
            <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
              Already have an account? <Link to="/login" state={location.state} style={{ color: 'var(--violet3)', fontWeight: 500 }}>Log in</Link>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
