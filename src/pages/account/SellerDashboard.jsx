import { useState, useEffect, useCallback } from 'react';
import { Store, Plus, Trash2, Pencil, Truck, Clock, X } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { applyAsSeller, getMyListings, getMySellerOrders } from '../../lib/api/sellers';
import { createListing, updateListing, deleteListing } from '../../lib/api/listings';
import { markShipped } from '../../lib/api/orders';
import { getCategories } from '../../lib/api/categories';

const inputStyle = {
  width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10,
  padding: '10px 14px', color: 'var(--text)', fontSize: 13.5, outline: 'none',
};
const labelStyle = { display: 'block', fontSize: 12, color: 'var(--text3)', marginBottom: 6, fontWeight: 500 };

const EMPTY_FORM = {
  title: '', category_id: '', brand: '', model: '', year_manufactured: '', condition: 'good',
  description: '', price_amount: '', currency: 'USD', origin_country: '', new_price_estimate: '', quantity: 1,
};

function ApplyForm({ onApplied }) {
  const [form, setForm] = useState({ org_name: '', country: '', account_type: 'organization', registration_no: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await applyAsSeller(form);
      onApplied();
    } catch (err) {
      setError(err.message || 'Could not submit application.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 18, padding: 28, maxWidth: 480 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Store size={18} color="var(--violet3)" />
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Become a seller</h3>
      </div>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={labelStyle}>Organization / business name</label>
          <input style={inputStyle} required value={form.org_name} onChange={e => setForm(f => ({ ...f, org_name: e.target.value }))} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Country (2-letter code)</label>
            <input style={inputStyle} required maxLength={2} value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value.toUpperCase() }))} />
          </div>
          <div>
            <label style={labelStyle}>Account type</label>
            <select style={inputStyle} value={form.account_type} onChange={e => setForm(f => ({ ...f, account_type: e.target.value }))}>
              <option value="organization">Organization</option>
              <option value="individual">Individual</option>
            </select>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Registration number (optional)</label>
          <input style={inputStyle} value={form.registration_no} onChange={e => setForm(f => ({ ...f, registration_no: e.target.value }))} />
        </div>
        {error && <div style={{ color: 'var(--red)', fontSize: 13 }}>{error}</div>}
        <button type="submit" disabled={busy} style={{
          background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
          padding: '12px 20px', borderRadius: 100, fontSize: 14, fontWeight: 600,
          opacity: busy ? 0.6 : 1, cursor: busy ? 'default' : 'pointer',
        }}>{busy ? 'Submitting…' : 'Submit application'}</button>
      </form>
    </div>
  );
}

function ListingForm({ categories, initial, onSaved, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function update(field) {
    return (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const payload = {
      ...form,
      year_manufactured: form.year_manufactured ? Number(form.year_manufactured) : undefined,
      price_amount: Number(form.price_amount),
      new_price_estimate: form.new_price_estimate ? Number(form.new_price_estimate) : undefined,
      quantity: Number(form.quantity) || 1,
      status: 'active',
    };
    try {
      if (initial?.id) await updateListing(initial.id, payload);
      else await createListing(payload);
      onSaved();
    } catch (err) {
      setError(err.message || 'Could not save listing.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 18, padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{initial?.id ? 'Edit listing' : 'New listing'}</h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}><X size={16} /></button>
      </div>
      <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Title</label>
          <input style={inputStyle} required value={form.title} onChange={update('title')} />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select style={inputStyle} required value={form.category_id} onChange={update('category_id')}>
            <option value="" disabled>Select a category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Condition</label>
          <select style={inputStyle} required value={form.condition} onChange={update('condition')}>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Brand</label>
          <input style={inputStyle} value={form.brand} onChange={update('brand')} />
        </div>
        <div>
          <label style={labelStyle}>Model</label>
          <input style={inputStyle} value={form.model} onChange={update('model')} />
        </div>
        <div>
          <label style={labelStyle}>Year manufactured</label>
          <input style={inputStyle} type="number" value={form.year_manufactured} onChange={update('year_manufactured')} />
        </div>
        <div>
          <label style={labelStyle}>Origin country (2-letter)</label>
          <input style={inputStyle} maxLength={2} value={form.origin_country} onChange={e => setForm(f => ({ ...f, origin_country: e.target.value.toUpperCase() }))} />
        </div>
        <div>
          <label style={labelStyle}>Price (USD)</label>
          <input style={inputStyle} type="number" min="0.01" step="0.01" required value={form.price_amount} onChange={update('price_amount')} />
        </div>
        <div>
          <label style={labelStyle}>New price estimate (optional)</label>
          <input style={inputStyle} type="number" min="0" step="0.01" value={form.new_price_estimate} onChange={update('new_price_estimate')} />
        </div>
        <div>
          <label style={labelStyle}>Quantity</label>
          <input style={inputStyle} type="number" min="1" value={form.quantity} onChange={update('quantity')} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={form.description} onChange={update('description')} />
        </div>
        {error && <div style={{ gridColumn: '1 / -1', color: 'var(--red)', fontSize: 13 }}>{error}</div>}
        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit" disabled={busy} style={{
            background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
            padding: '12px 22px', borderRadius: 100, fontSize: 14, fontWeight: 600,
            opacity: busy ? 0.6 : 1, cursor: busy ? 'default' : 'pointer',
          }}>{busy ? 'Saving…' : initial?.id ? 'Save changes' : 'Publish listing'}</button>
        </div>
      </form>
    </div>
  );
}

export default function SellerDashboard() {
  const { sellerProfile, refreshSellerProfile } = useAuth();
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const isApproved = sellerProfile?.kyb_status === 'approved';

  const loadData = useCallback(async () => {
    if (!isApproved) { setLoading(false); return; }
    setLoading(true);
    const [cats, listingsRes, ordersRes] = await Promise.all([
      getCategories(), getMyListings(), getMySellerOrders(),
    ]);
    setCategories(cats);
    setListings(listingsRes.data);
    setOrders(ordersRes.data);
    setLoading(false);
  }, [isApproved]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this listing?')) return;
    await deleteListing(id);
    loadData();
  }

  async function handleShip(orderId) {
    await markShipped(orderId);
    loadData();
  }

  return (
    <>
      <PageHeader eyebrow="Your account" title="Seller" titleItalic="dashboard" />
      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          {!sellerProfile && <ApplyForm onApplied={refreshSellerProfile} />}

          {sellerProfile?.kyb_status === 'pending' && (
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 18, padding: 28, maxWidth: 480 }}>
              <Clock size={20} color="var(--amber)" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Application under review</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text3)', lineHeight: 1.6 }}>
                Thanks for applying to sell on AssetWave. Our team is reviewing <strong>{sellerProfile.org_name}</strong>. You'll be able to list equipment once approved.
              </p>
            </div>
          )}

          {(sellerProfile?.kyb_status === 'rejected' || sellerProfile?.kyb_status === 'suspended') && (
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 18, padding: 28, maxWidth: 480 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--red)', marginBottom: 6 }}>
                {sellerProfile.kyb_status === 'rejected' ? 'Application not approved' : 'Seller account suspended'}
              </h3>
              {sellerProfile.kyb_notes && <p style={{ fontSize: 13.5, color: 'var(--text3)' }}>{sellerProfile.kyb_notes}</p>}
            </div>
          )}

          {isApproved && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>Your listings</h3>
                {!showForm && (
                  <button onClick={() => { setEditing(null); setShowForm(true); }} style={{
                    display: 'flex', alignItems: 'center', gap: 8, background: 'var(--inverse-bg)', color: 'var(--inverse-text)',
                    border: 'none', padding: '10px 18px', borderRadius: 100, fontSize: 13.5, fontWeight: 600,
                  }}><Plus size={15} /> New listing</button>
                )}
              </div>

              {showForm && (
                <ListingForm
                  categories={categories}
                  initial={editing}
                  onCancel={() => setShowForm(false)}
                  onSaved={() => { setShowForm(false); loadData(); }}
                />
              )}

              {loading ? (
                <div style={{ color: 'var(--text3)', fontSize: 14, padding: '20px 0' }}>Loading…</div>
              ) : listings.length === 0 ? (
                <div style={{ color: 'var(--text3)', fontSize: 14, padding: '20px 0' }}>You haven't listed any equipment yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }}>
                  {listings.map(listing => (
                    <div key={listing.id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                      background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 16,
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{listing.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text3)' }}>{listing.status} · ${listing.price_amount.toLocaleString()} · qty {listing.quantity}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => { setEditing({ ...listing, price_amount: String(listing.price_amount) }); setShowForm(true); }} style={iconBtnStyle}><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(listing.id)} style={iconBtnStyle}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>Orders on your items</h3>
              {orders.length === 0 ? (
                <div style={{ color: 'var(--text3)', fontSize: 14 }}>No orders yet.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {orders.map(item => (
                    <div key={item.order_item_id} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
                      background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 14, padding: 16,
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{item.title_snapshot} × {item.quantity}</div>
                        <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                          {item.order_status.replace('_', ' ')} · buyer: {item.buyer_name || 'unknown'}
                        </div>
                      </div>
                      {item.order_status === 'paid' && (
                        <button onClick={() => handleShip(item.order_id)} style={{
                          display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface2)', border: '1px solid var(--border)',
                          color: 'var(--text)', padding: '8px 14px', borderRadius: 100, fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
                        }}><Truck size={13} /> Mark shipped</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

const iconBtnStyle = {
  width: 32, height: 32, borderRadius: 8, background: 'var(--surface2)', border: '1px solid var(--border)',
  color: 'var(--text2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};
