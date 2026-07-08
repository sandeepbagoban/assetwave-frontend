import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, Truck, ShieldCheck, Clock } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import { getOrder, confirmDelivery } from '../lib/api/orders';
import Skeleton from '../components/shared/ui/Skeleton';

const STATUS_LABEL = {
  pending_payment: 'Payment pending', paid: 'Paid — in escrow', shipped: 'Shipped',
  delivered: 'Delivered', released: 'Completed — escrow released', refunded: 'Refunded',
  disputed: 'Disputed', cancelled: 'Cancelled',
};

const STATUS_COLOR = {
  pending_payment: 'var(--amber)', paid: 'var(--ice)', shipped: 'var(--violet3)',
  delivered: 'var(--green)', released: 'var(--green)', refunded: 'var(--red)',
  disputed: 'var(--red)', cancelled: 'var(--text4)',
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOrder(await getOrder(id));
    } catch (err) {
      setError(err.message || 'Could not load this order.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function handleConfirmDelivery() {
    setConfirming(true);
    try {
      await confirmDelivery(id);
      await load();
    } catch (err) {
      setError(err.message || 'Could not confirm delivery.');
    } finally {
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <section className="section-sm" style={{ background: 'var(--bg)', paddingTop: 180 }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {[24, 24, 24].map((_, i) => (
            <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 18, padding: 24, marginBottom: 24 }}>
              <Skeleton width="40%" height={16} style={{ marginBottom: 16 }} />
              <Skeleton width="90%" height={13} style={{ marginBottom: 10 }} />
              <Skeleton width="70%" height={13} />
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (error && !order) return <div style={{ padding: '180px 0 80px', textAlign: 'center', color: 'var(--red)' }}>{error}</div>;
  if (!order) return null;

  return (
    <>
      <PageHeader
        eyebrow={`Order #${order.id.slice(0, 8)}`}
        title="Thank you for your"
        titleItalic="order"
        desc={`Placed on ${new Date(order.placed_at).toLocaleDateString()}`}
      />
      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="aw-surface" style={{
            borderRadius: 18, padding: 24, marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLOR[order.status] }} />
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{STATUS_LABEL[order.status] || order.status}</span>
            </div>
            {order.status === 'shipped' && (
              <button onClick={handleConfirmDelivery} disabled={confirming} style={{
                display: 'flex', alignItems: 'center', gap: 8, background: 'var(--inverse-bg)', color: 'var(--inverse-text)',
                border: 'none', padding: '11px 20px', borderRadius: 100, fontSize: 13.5, fontWeight: 600,
                opacity: confirming ? 0.6 : 1, cursor: confirming ? 'default' : 'pointer',
              }}>
                <PackageCheck size={15} /> {confirming ? 'Confirming…' : 'Confirm delivery received'}
              </button>
            )}
          </div>

          {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 16 }}>{error}</div>}

          <div className="aw-surface" style={{ borderRadius: 18, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 16 }}>Items</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--text2)' }}>{item.title} × {item.quantity}</span>
                  <span style={{ color: 'var(--text)' }}>${(item.price_amount * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Total</span>
              <span className="serif" style={{ fontSize: 20, color: 'var(--text)' }}>${order.total_amount.toLocaleString()}</span>
            </div>
          </div>

          <div className="aw-surface" style={{ borderRadius: 18, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={16} color="var(--violet3)" /> Escrow &amp; shipping timeline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {order.status_history.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Clock size={14} color="var(--text4)" style={{ marginTop: 3, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 500 }}>{STATUS_LABEL[h.to] || h.to}</div>
                    {h.note && <div style={{ fontSize: 12.5, color: 'var(--text3)' }}>{h.note}</div>}
                    <div style={{ fontSize: 11.5, color: 'var(--text4)' }}>{new Date(h.at).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="aw-surface" style={{ borderRadius: 18, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Truck size={16} /> Shipping to
            </h3>
            <div style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.7 }}>
              {order.shipping_address.name}<br />
              {order.shipping_address.line1}{order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ''}<br />
              {order.shipping_address.city}, {order.shipping_address.country} {order.shipping_address.postal_code}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link to="/account/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--violet3)', fontSize: 13.5, fontWeight: 500 }}>
              <CheckCircle2 size={15} /> View all orders
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
