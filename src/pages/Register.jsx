import CountrySelect from '../components/shared/CountrySelect';
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { UserPlus, ShoppingBag, Store, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/shared/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { applyAsSeller } from '../lib/api/sellers';
import { inputStyle, labelStyle } from '../components/shared/ui/styles';

export default function Register() {
  const { register, loading, refreshSellerProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [intent, setIntent] = useState(location.state?.intent === 'seller' ? 'seller' : 'buyer');
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [sellerForm, setSellerForm] = useState({ org_name: '', nickname: '', country: '', account_type: 'organization', registration_no: '' });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    if (!acceptedTerms) {
      setError('You must accept the Terms of Use and Privacy Policy to continue.');
      return;
    }
    setSubmitting(true);
    try {
      await register({ ...form, accepted_terms: true, legal_version: '2026-10-25' });
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
      navigate('/account/seller/apply', { replace: true });
    } else {
      navigate('/account/orders', { replace: true });
    }
  }

  const busy = loading || submitting;

  return (
    <AuthLayout title="Create your AWXchange account." description="Create your account to enquire about equipment or apply to sell surplus telecom and broadcast inventory.">
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

          <form onSubmit={handleSubmit} className="aw-surface" style={{
            borderRadius: 18, padding: 32,
            display: 'flex', flexDirection: 'column', gap: 18,
          }}>
            <div>
              <label htmlFor="field-full-name" style={labelStyle}>Full name</label>
              <input id="field-full-name" style={inputStyle} required value={form.full_name} onChange={update('full_name')} placeholder="Jane Doe" />
            </div>
            <div>
              <label htmlFor="field-email" style={labelStyle}>Email</label>
              <input id="field-email" style={inputStyle} type="email" autoComplete="email" required value={form.email} onChange={update('email')} placeholder="you@company.com" />
            </div>
            <div>
              <label htmlFor="field-phone-optional" style={labelStyle}>Phone (optional)</label>
              <input id="field-phone-optional" style={inputStyle} value={form.phone} onChange={update('phone')} placeholder="+1 555 000 0000" />
            </div>
            <div>
              <label htmlFor="field-password" style={labelStyle}>Password</label>
              <div className="password-field"><input id="field-password" style={inputStyle} type={showPassword ? 'text' : 'password'} autoComplete="new-password" required minLength={8} value={form.password} onChange={update('password')} placeholder="At least 8 characters" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div>
            </div>

            {intent === 'seller' && (
              <>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  Seller details
                </div>
                <div>
                  <label htmlFor="field-organization-business-name" style={labelStyle}>Organization / business name</label>
                  <input id="field-organization-business-name" style={inputStyle} required value={sellerForm.org_name} onChange={updateSeller('org_name')} />
                  <div style={{ fontSize: 11.5, color: 'var(--text4)', marginTop: 6 }}>Kept private — never shown to buyers.</div>
                </div>
                <div>
                  <label htmlFor="field-public-nickname" style={labelStyle}>Public nickname</label>
                  <input id="field-public-nickname" style={inputStyle} required value={sellerForm.nickname} onChange={updateSeller('nickname')} placeholder="Shown to buyers instead of your company name" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Country</label>
                    <CountrySelect style={inputStyle} required  value={sellerForm.country} onChange={e => setSellerForm(f => ({ ...f, country: e.target.value.toUpperCase() }))} />
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
                  <label htmlFor="field-registration-number-optional" style={labelStyle}>Registration number (optional)</label>
                  <input id="field-registration-number-optional" style={inputStyle} value={sellerForm.registration_no} onChange={updateSeller('registration_no')} />
                </div>
              </>
            )}

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6 }}>
              <input
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={e => setAcceptedTerms(e.target.checked)}
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              <span>
                I accept the <Link to="/terms" target="_blank" style={{ color: 'var(--violet3)' }}>Terms of Use</Link> and{' '}
                <Link to="/privacy" target="_blank" style={{ color: 'var(--violet3)' }}>Privacy Policy</Link>.
              </span>
            </label>

            {error && <div role="alert" style={{ color: 'var(--red)', fontSize: 13 }}>{error}</div>}

            <button type="submit" disabled={busy} className="aw-btn" style={{
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
    </AuthLayout>
  );
}
