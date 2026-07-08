import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { useCart } from '../context/CartContext';
import { checkout } from '../lib/api/orders';
import { inputStyle as baseInputStyle, labelStyle as baseLabelStyle } from '../components/shared/ui/styles';

const inputStyle = { ...baseInputStyle, padding: '11px 14px' };
const labelStyle = { ...baseLabelStyle, fontSize: 12.5, marginBottom: 6 };

export default function Checkout() {
  const { cart, loading, refresh } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState({ name: '', line1: '', line2: '', city: '', country: '', postal_code: '', phone: '' });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  function update(field) {
    return (e) => setAddress(a => ({ ...a, [field]: e.target.value }));
  }

  const items = cart?.items || [];

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const order = await checkout(address);
      await refresh();
      navigate(`/orders/${order.id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Checkout failed.');
    } finally {
      setPlacing(false);
    }
  }

  if (!loading && items.length === 0) {
    return (
      <div style={{ padding: '180px 0 80px', textAlign: 'center' }}>
        <div style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 20 }}>Your cart is empty — add something before checking out.</div>
        <Link to="/marketplace" style={{ color: 'var(--violet3)', fontWeight: 500 }}>Browse marketplace</Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Checkout" title="Confirm your" titleItalic="order" />
      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 40, alignItems: 'flex-start' }}>
          <form onSubmit={handlePlaceOrder} className="aw-surface" style={{
            borderRadius: 18, padding: 28,
            display: 'flex', flexDirection: 'column', gap: 16,
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Shipping address</h3>
            <div>
              <label style={labelStyle}>Full name</label>
              <input style={inputStyle} required value={address.name} onChange={update('name')} />
            </div>
            <div>
              <label style={labelStyle}>Address line 1</label>
              <input style={inputStyle} required value={address.line1} onChange={update('line1')} />
            </div>
            <div>
              <label style={labelStyle}>Address line 2 (optional)</label>
              <input style={inputStyle} value={address.line2} onChange={update('line2')} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>City</label>
                <input style={inputStyle} required value={address.city} onChange={update('city')} />
              </div>
              <div>
                <label style={labelStyle}>Postal code</label>
                <input style={inputStyle} required value={address.postal_code} onChange={update('postal_code')} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={labelStyle}>Country (2-letter code)</label>
                <input style={inputStyle} required maxLength={2} placeholder="US" value={address.country} onChange={e => setAddress(a => ({ ...a, country: e.target.value.toUpperCase() }))} />
              </div>
              <div>
                <label style={labelStyle}>Phone (optional)</label>
                <input style={inputStyle} value={address.phone} onChange={update('phone')} />
              </div>
            </div>

            <div style={{
              marginTop: 8, padding: 16, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <Lock size={16} color="var(--violet3)" style={{ marginTop: 1, flexShrink: 0 }} />
              <div style={{ fontSize: 12.5, color: 'var(--text3)', lineHeight: 1.6 }}>
                This is a simulated payment for demo purposes — no real card is charged. Your payment is captured immediately and held in escrow until you confirm delivery.
              </div>
            </div>

            {error && <div style={{ color: 'var(--red)', fontSize: 13 }}>{error}</div>}

            <button type="submit" disabled={placing} className="aw-btn" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
              padding: '14px 20px', borderRadius: 100, fontSize: 14.5, fontWeight: 600,
              opacity: placing ? 0.6 : 1, cursor: placing ? 'default' : 'pointer', marginTop: 4,
            }}>
              <ShieldCheck size={16} /> {placing ? 'Placing order…' : `Pay $${(cart?.subtotal || 0).toLocaleString()} & place order`}
            </button>
          </form>

          <div className="aw-surface" style={{ borderRadius: 18, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Order summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                  <span style={{ color: 'var(--text2)' }}>{item.listing.title} × {item.quantity}</span>
                  <span style={{ color: 'var(--text)' }}>${(item.listing.price_amount * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Total</span>
              <span className="serif" style={{ fontSize: 20, color: 'var(--text)' }}>${(cart?.subtotal || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
