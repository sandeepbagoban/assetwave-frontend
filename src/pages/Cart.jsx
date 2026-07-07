import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState(null);

  async function changeQty(item, delta) {
    const next = item.quantity + delta;
    if (next < 1) return;
    setBusyId(item.id);
    try { await updateItem(item.id, next); } finally { setBusyId(null); }
  }

  async function remove(item) {
    setBusyId(item.id);
    try { await removeItem(item.id); } finally { setBusyId(null); }
  }

  const items = cart?.items || [];

  return (
    <>
      <PageHeader eyebrow="Your cart" title="Review your" titleItalic="equipment" />
      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {loading && <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text3)' }}>Loading cart…</div>}

          {!loading && items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <ShoppingBag size={32} color="var(--text4)" style={{ marginBottom: 16 }} />
              <div style={{ color: 'var(--text3)', fontSize: 14, marginBottom: 20 }}>Your cart is empty.</div>
              <Link to="/marketplace" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--inverse-bg)', color: 'var(--inverse-text)',
                padding: '12px 22px', borderRadius: 100, fontSize: 14, fontWeight: 600,
              }}>Browse marketplace <ArrowRight size={14} /></Link>
            </div>
          )}

          {!loading && items.length > 0 && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                {items.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg3)',
                    border: '1px solid var(--border)', borderRadius: 16, padding: 18,
                    opacity: busyId === item.id ? 0.6 : 1,
                  }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 12, flexShrink: 0,
                      background: 'linear-gradient(160deg, #1A1430, #0F0F1A)',
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{item.listing.title}</div>
                      <div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{item.listing.seller?.name}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <button onClick={() => changeQty(item, -1)} disabled={busyId === item.id} style={qtyBtnStyle}><Minus size={13} /></button>
                      <span style={{ fontSize: 14, color: 'var(--text)', minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => changeQty(item, 1)} disabled={busyId === item.id} style={qtyBtnStyle}><Plus size={13} /></button>
                    </div>
                    <div className="serif" style={{ fontSize: 18, color: 'var(--text)', minWidth: 90, textAlign: 'right' }}>
                      ${(item.listing.price_amount * item.quantity).toLocaleString()}
                    </div>
                    <button onClick={() => remove(item)} disabled={busyId === item.id} style={{
                      background: 'none', border: 'none', color: 'var(--text4)', cursor: 'pointer', padding: 6,
                    }}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 16, padding: 22,
              }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>Subtotal</div>
                  <div className="serif" style={{ fontSize: 26, color: 'var(--text)' }}>${cart.subtotal.toLocaleString()}</div>
                </div>
                <button onClick={() => navigate('/checkout')} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
                  padding: '14px 26px', borderRadius: 100, fontSize: 14.5, fontWeight: 600,
                }}>Proceed to checkout <ArrowRight size={15} /></button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

const qtyBtnStyle = {
  width: 28, height: 28, borderRadius: 8, background: 'var(--surface2)', border: '1px solid var(--border)',
  color: 'var(--text2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};
