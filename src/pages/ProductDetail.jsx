import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, ShoppingCart, Zap } from 'lucide-react';
import { useListing } from '../hooks/useListings';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { resolveAssetUrl } from '../lib/api/client';
import { clearOtherItems } from '../lib/api/cart';

const CONDITION_STYLE = {
  excellent: { bg: 'rgba(74,222,128,0.12)', color: '#4ADE80' },
  good: { bg: 'rgba(125,211,232,0.12)', color: '#7DD3E8' },
  fair: { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24' },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: listing, loading, error } = useListing(id);
  const { user } = useAuth();
  const { cart, addItem, refresh: refreshCart } = useCart();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [otherCartCount, setOtherCartCount] = useState(0);

  if (loading) {
    return <div style={{ padding: '180px 0 80px', textAlign: 'center', color: 'var(--text3)' }}>Loading listing…</div>;
  }
  if (error || !listing) {
    return (
      <div style={{ padding: '180px 0 80px', textAlign: 'center', color: 'var(--red)' }}>
        Couldn't load this listing{error ? `: ${error}` : '.'}
      </div>
    );
  }

  const cond = CONDITION_STYLE[listing.condition] || CONDITION_STYLE.good;
  const savingPct = listing.new_price_estimate
    ? Math.round((1 - listing.price_amount / listing.new_price_estimate) * 100)
    : null;

  async function requireLogin(reason) {
    if (!user) {
      navigate('/login', { state: { from: `/marketplace/${id}`, reason } });
      return false;
    }
    return true;
  }

  async function handleAddToCart() {
    if (!(await requireLogin('add-to-cart'))) return;
    setBusy(true);
    setNotice('');
    try {
      await addItem(listing.id, 1);
      setNotice('Added to cart.');
    } catch (err) {
      setNotice(err.message || 'Could not add to cart.');
    } finally {
      setBusy(false);
    }
  }

  async function handleBuyNow() {
    if (!(await requireLogin('buy'))) return;
    const others = (cart?.items || []).filter(i => i.listing.id !== listing.id);
    if (others.length > 0) {
      setOtherCartCount(others.length);
      return;
    }
    await addAndCheckout();
  }

  async function addAndCheckout() {
    setBusy(true);
    setNotice('');
    try {
      await addItem(listing.id, 1);
      navigate('/checkout');
    } catch (err) {
      setNotice(err.message || 'Could not start checkout.');
      setBusy(false);
    }
  }

  async function handleReplaceCartAndBuy() {
    setBusy(true);
    setNotice('');
    try {
      await clearOtherItems(cart, listing.id);
      await refreshCart();
      await addAndCheckout();
    } catch (err) {
      setNotice(err.message || 'Could not update your cart.');
      setBusy(false);
    } finally {
      setOtherCartCount(0);
    }
  }

  return (
    <section className="section-sm" style={{ background: 'var(--bg)', paddingTop: 140 }}>
      <div className="container">
        <Link to="/marketplace" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text3)', marginBottom: 28 }}>
          <ArrowLeft size={14} /> Back to marketplace
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48 }}>
          <div>
            <div style={{
              height: 380, borderRadius: 20, overflow: 'hidden',
              background: listing.images?.[activeImage] ? `center/cover no-repeat url(${resolveAssetUrl(listing.images[activeImage])})` : 'linear-gradient(160deg, #1A1430, #0F0F1A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
            }}>
              <span style={{
                position: 'absolute', top: 16, left: 16, fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.04em', padding: '5px 12px', borderRadius: 100, background: cond.bg, color: cond.color,
              }}>{listing.condition}</span>
              {!listing.images?.[activeImage] && (
                <svg width="90" height="90" viewBox="0 0 56 56" opacity="0.5">
                  <circle cx="28" cy="28" r="26" stroke="url(#pdicon)" strokeWidth="1.2" />
                  <circle cx="28" cy="28" r="8" fill="url(#pdicon)" opacity="0.5" />
                  <defs><linearGradient id="pdicon" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#B4A9FB" /><stop offset="1" stopColor="#7DD3E8" /></linearGradient></defs>
                </svg>
              )}
            </div>
            {listing.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                {listing.images.map((img, i) => (
                  <div key={i} onClick={() => setActiveImage(i)} style={{
                    width: 72, height: 72, borderRadius: 10, backgroundImage: `url(${resolveAssetUrl(img)})`,
                    backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer',
                    border: '2px solid ' + (i === activeImage ? 'var(--violet)' : 'var(--border)'),
                  }} />
                ))}
              </div>
            )}

            {listing.description && (
              <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Description</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>{listing.description}</p>
              </div>
            )}

            <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {[
                ['Brand', listing.brand], ['Model', listing.model],
                ['Year', listing.year_manufactured], ['Origin', listing.origin_country],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, color: 'var(--text4)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h1 className="serif" style={{ fontSize: 32, color: 'var(--text)', lineHeight: 1.2, marginBottom: 16 }}>{listing.title}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text3)', marginBottom: 24 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80' }} />
              Sold by <strong style={{ color: 'var(--text2)' }}>{listing.seller?.name}</strong>
              {listing.seller?.verified && <ShieldCheck size={14} color="var(--violet3)" />}
            </div>

            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 18, padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 6 }}>
                <span className="serif" style={{ fontSize: 34, color: 'var(--text)' }}>${listing.price_amount.toLocaleString()}</span>
                {listing.new_price_estimate && (
                  <span style={{ fontSize: 14, color: 'var(--text4)', textDecoration: 'line-through', marginBottom: 4 }}>
                    ${listing.new_price_estimate.toLocaleString()}
                  </span>
                )}
              </div>
              {savingPct !== null && (
                <span style={{ fontSize: 12, fontWeight: 600, color: '#4ADE80', background: 'rgba(74,222,128,0.12)', padding: '3px 10px', borderRadius: 6 }}>
                  Save {savingPct}% vs. new
                </span>
              )}

              <div title="Simulated for this demo — no real payment is captured" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--violet3)', fontWeight: 500, marginTop: 18, marginBottom: 18, cursor: 'help' }}>
                <ShieldCheck size={15} /> Escrow protected (demo) — funds released only after you confirm delivery
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={handleBuyNow} disabled={busy} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
                  padding: '14px 20px', borderRadius: 100, fontSize: 14.5, fontWeight: 600,
                  opacity: busy ? 0.6 : 1, cursor: busy ? 'default' : 'pointer',
                }}>
                  <Zap size={16} /> Buy now
                </button>
                <button onClick={handleAddToCart} disabled={busy} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)',
                  padding: '14px 20px', borderRadius: 100, fontSize: 14.5, fontWeight: 600,
                  opacity: busy ? 0.6 : 1, cursor: busy ? 'default' : 'pointer',
                }}>
                  <ShoppingCart size={16} /> Add to cart
                </button>
              </div>

              {otherCartCount > 0 && (
                <div style={{
                  marginTop: 14, padding: 14, borderRadius: 12, background: 'var(--surface)',
                  border: '1px solid var(--border)', fontSize: 13, color: 'var(--text2)',
                }}>
                  You have {otherCartCount} other item{otherCartCount > 1 ? 's' : ''} in your cart. Buy Now checks out your whole cart together.
                  <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <button onClick={handleReplaceCartAndBuy} disabled={busy} style={{
                      background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
                      padding: '8px 14px', borderRadius: 100, fontSize: 12.5, fontWeight: 600,
                      opacity: busy ? 0.6 : 1, cursor: busy ? 'default' : 'pointer',
                    }}>Replace cart & buy now</button>
                    <button onClick={() => setOtherCartCount(0)} disabled={busy} style={{
                      background: 'none', border: 'none', color: 'var(--text3)', fontSize: 12.5, cursor: 'pointer',
                    }}>Cancel</button>
                  </div>
                </div>
              )}

              {notice && <div style={{ marginTop: 14, fontSize: 13, color: notice.includes('Added') ? '#4ADE80' : 'var(--red)' }}>{notice}</div>}
            </div>

            <div style={{ fontSize: 12.5, color: 'var(--text4)' }}>
              {listing.quantity > 1 ? `${listing.quantity} units available` : 'Only 1 unit available'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
