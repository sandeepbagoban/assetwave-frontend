import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Package } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { getOrders } from '../../lib/api/orders';

const STATUS_COLOR = {
  pending_payment: '#FBBF24', paid: '#7DD3E8', shipped: '#B4A9FB',
  delivered: '#4ADE80', released: '#4ADE80', refunded: '#F87171',
  disputed: '#F87171', cancelled: 'var(--text4)',
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrders()
      .then(res => setOrders(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Your account" title="Order" titleItalic="history" />
      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {loading && <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '40px 0' }}>Loading orders…</div>}
          {error && <div style={{ textAlign: 'center', color: 'var(--red)', padding: '40px 0' }}>{error}</div>}
          {!loading && !error && orders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Package size={32} color="var(--text4)" style={{ marginBottom: 16 }} />
              <div style={{ color: 'var(--text3)', fontSize: 14 }}>You haven't placed any orders yet.</div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {orders.map(order => (
              <Link key={order.id} to={`/orders/${order.id}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 18,
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                    Order #{order.id.slice(0, 8)}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text3)' }}>
                    {new Date(order.placed_at).toLocaleDateString()} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--text2)' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLOR[order.status] }} />
                    {order.status.replace('_', ' ')}
                  </span>
                  <span className="serif" style={{ fontSize: 17, color: 'var(--text)' }}>${order.total_amount.toLocaleString()}</span>
                  <ArrowUpRight size={15} color="var(--text3)" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
