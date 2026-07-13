import { useState, useEffect, useCallback, useRef } from 'react';
import { Store, Plus, Trash2, Pencil, Truck, Clock, X, Upload, Calendar, LayoutDashboard, Package, ClipboardList } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { applyAsSeller, getMyListings, getMySellerOrders, getMyStats } from '../../lib/api/sellers';
import { createListing, updateListing, deleteListing, addListingImages } from '../../lib/api/listings';
import { previewSellerImport, commitSellerImport, SELLER_IMPORT_COLUMNS } from '../../lib/api/sellerImports';
import { markShipped, recordTracking } from '../../lib/api/orders';
import { getCategories } from '../../lib/api/categories';
import ImagePicker from '../../components/shared/ui/ImagePicker';
import ConfirmButton from '../../components/shared/ui/ConfirmButton';
import Skeleton from '../../components/shared/ui/Skeleton';
import { Sparkline, DonutChart } from '../../components/shared/ui/charts';
import OrderTracker from '../../components/shared/ui/OrderTracker';
import Table from '../../components/shared/ui/Table';
import { iconBtnStyle, inputStyle as baseInputStyle, labelStyle as baseLabelStyle } from '../../components/shared/ui/styles';

const inputStyle = { ...baseInputStyle, background: 'var(--bg2)', padding: '10px 14px', fontSize: 13.5 };
const labelStyle = { ...baseLabelStyle, fontSize: 12, marginBottom: 6 };

const EMPTY_FORM = {
  title: '', category_id: '', brand: '', model: '', year_manufactured: '', condition: 'good',
  description: '', price_amount: '', currency: 'USD', origin_country: '', new_price_estimate: '', quantity: 1,
  weight_kg: '', length_cm: '', width_cm: '', height_cm: '',
};

const STATUS_CHART_COLORS = {
  pending_payment: '#FBBF24', paid: '#7DD3E8', shipped: '#B4A9FB',
  delivered: '#4ADE80', released: '#4ADE80', refunded: '#F87171',
  disputed: '#F87171', cancelled: '#64748B',
};

function ApplyForm({ onApplied }) {
  const [form, setForm] = useState({ org_name: '', nickname: '', country: '', account_type: 'organization', registration_no: '' });
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
    <div className="aw-surface" style={{ borderRadius: 18, padding: 28, maxWidth: 480 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Store size={18} color="var(--violet3)" />
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Become a seller</h3>
      </div>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={labelStyle}>Organization / business name</label>
          <input style={inputStyle} required value={form.org_name} onChange={e => setForm(f => ({ ...f, org_name: e.target.value }))} />
          <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 6 }}>Kept private — never shown to buyers.</div>
        </div>
        <div>
          <label style={labelStyle}>Public nickname</label>
          <input style={inputStyle} required value={form.nickname} onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))} placeholder="Shown to buyers instead of your company name" />
        </div>
        <div className="aw-grid-2" style={{ display: 'grid', gap: 12 }}>
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
        <button type="submit" disabled={busy} className="aw-btn" style={{
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
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
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
      weight_kg: form.weight_kg ? Number(form.weight_kg) : undefined,
      length_cm: form.length_cm ? Number(form.length_cm) : undefined,
      width_cm: form.width_cm ? Number(form.width_cm) : undefined,
      height_cm: form.height_cm ? Number(form.height_cm) : undefined,
      status: 'active',
    };
    let saved;
    try {
      saved = initial?.id ? await updateListing(initial.id, payload) : await createListing(payload);
    } catch (err) {
      setError(err.message || 'Could not save listing.');
      setBusy(false);
      return;
    }

    if (files.length) {
      setUploadingPhotos(true);
      try {
        await addListingImages(saved.id, files);
      } catch (err) {
        setError(`Listing saved, but photo upload failed: ${err.message}. You can retry from Edit.`);
        setBusy(false);
        setUploadingPhotos(false);
        onSaved();
        return;
      }
      setUploadingPhotos(false);
    }
    setBusy(false);
    onSaved();
  }

  return (
    <div className="aw-surface" style={{ borderRadius: 18, padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{initial?.id ? 'Edit listing' : 'New listing'}</h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}><X size={16} /></button>
      </div>
      <form onSubmit={submit} className="aw-grid-2" style={{ display: 'grid', gap: 14 }}>
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
        <div>
          <label style={labelStyle}>Weight (kg, optional)</label>
          <input style={inputStyle} type="number" min="0" step="0.01" value={form.weight_kg} onChange={update('weight_kg')} />
        </div>
        <div className="aw-grid-3" style={{ display: 'grid', gap: 8 }}>
          <div>
            <label style={labelStyle}>Length (cm)</label>
            <input style={inputStyle} type="number" min="0" step="0.1" value={form.length_cm} onChange={update('length_cm')} />
          </div>
          <div>
            <label style={labelStyle}>Width (cm)</label>
            <input style={inputStyle} type="number" min="0" step="0.1" value={form.width_cm} onChange={update('width_cm')} />
          </div>
          <div>
            <label style={labelStyle}>Height (cm)</label>
            <input style={inputStyle} type="number" min="0" step="0.1" value={form.height_cm} onChange={update('height_cm')} />
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={form.description} onChange={update('description')} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Photos</label>
          <ImagePicker existingImages={initial?.images || []} files={files} onFilesChange={setFiles} />
        </div>
        {error && <div style={{ gridColumn: '1 / -1', color: 'var(--red)', fontSize: 13 }}>{error}</div>}
        <div style={{ gridColumn: '1 / -1' }}>
          <button type="submit" disabled={busy} className="aw-btn" style={{
            background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
            padding: '12px 22px', borderRadius: 100, fontSize: 14, fontWeight: 600,
            opacity: busy ? 0.6 : 1, cursor: busy ? 'default' : 'pointer',
          }}>{busy ? (uploadingPhotos ? 'Uploading photos…' : 'Saving…') : initial?.id ? 'Save changes' : 'Publish listing'}</button>
        </div>
      </form>
    </div>
  );
}

const thStyle = { textAlign: 'left', padding: '8px 10px', color: 'var(--text3)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.03em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' };
const tdStyle = { padding: '8px 10px', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap', color: 'var(--text2)' };

function MiniStat({ label, value, color }) {
  return (
    <div className="aw-surface" style={{ borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 4 }}>{label}</div>
      <div className="serif" style={{ fontSize: 22, color: color || 'var(--text)' }}>{value}</div>
    </div>
  );
}

function BulkImportPanel({ onCancel, onImported }) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [preview, setPreviewState] = useState(null);
  const [commitResult, setCommitResult] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [committing, setCommitting] = useState(false);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError('');
    setCommitResult(null);
    setPreviewState(null);
    setUploading(true);
    try {
      setPreviewState(await previewSellerImport(file));
    } catch (err) {
      setError(err.message || 'Could not preview this file.');
    } finally {
      setUploading(false);
    }
  }

  async function handleCommit() {
    if (!preview) return;
    setError('');
    setCommitting(true);
    try {
      setCommitResult(await commitSellerImport(preview.job_id));
    } catch (err) {
      setError(err.message || 'Could not commit this import.');
    } finally {
      setCommitting(false);
    }
  }

  function resetAll() {
    setPreviewState(null);
    setCommitResult(null);
    setError('');
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="aw-surface" style={{ borderRadius: 18, padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Bulk upload listings</h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}><X size={16} /></button>
      </div>

      <div style={{ background: 'var(--bg2)', border: '1px dashed var(--border)', borderRadius: 12, padding: '14px 16px', fontSize: 12.5, color: 'var(--text3)', marginBottom: 18, lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--text2)' }}>Expected column headers (row 1, case-insensitive):</strong>
        <div style={{ marginTop: 6, fontFamily: 'monospace', fontSize: 11.5, color: 'var(--text2)', wordBreak: 'break-word' }}>{SELLER_IMPORT_COLUMNS.join(', ')}</div>
        <div style={{ marginTop: 8 }}><code>category_slug</code> must match an existing category slug (e.g. <code>cameras</code>, <code>audio</code>) or that row will error out.</div>
      </div>

      {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 14 }}>{error}</div>}

      {!commitResult && (
        <>
          <div style={{ border: '1px dashed var(--border)', borderRadius: 12, padding: 24, textAlign: 'center', marginBottom: 18 }}>
            <p style={{ fontSize: 13.5, color: 'var(--text2)', marginBottom: 10 }}>Select an .xlsx file to preview</p>
            <input ref={fileInputRef} type="file" accept=".xlsx" onChange={handleFileChange} style={{ fontSize: 13, color: 'var(--text3)' }} />
            {fileName && <p style={{ fontSize: 12.5, color: 'var(--text3)', marginTop: 8 }}>Selected: {fileName}</p>}
            {uploading && <p style={{ fontSize: 12.5, color: 'var(--text3)', marginTop: 4 }}>Uploading and validating…</p>}
          </div>

          {preview && (
            <>
              <div className="aw-grid-3" style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
                <MiniStat label="Total rows" value={preview.row_count} />
                <MiniStat label="Valid" value={preview.valid_count} color="var(--green)" />
                <MiniStat label="Errors" value={preview.error_count} color="var(--red)" />
              </div>

              <div style={{ overflowX: 'auto', marginBottom: 18, border: '1px solid var(--border)', borderRadius: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Row</th>
                      {SELLER_IMPORT_COLUMNS.map(col => <th key={col} style={thStyle}>{col}</th>)}
                      <th style={thStyle}>Errors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map(row => (
                      <tr key={row.row_num} style={{ background: row.errors.length ? 'rgba(248,113,113,0.08)' : 'transparent' }}>
                        <td style={tdStyle}>{row.row_num}</td>
                        {SELLER_IMPORT_COLUMNS.map(col => <td key={col} style={tdStyle}>{row.data[col] ?? ''}</td>)}
                        <td style={{ ...tdStyle, color: row.errors.length ? 'var(--red)' : 'var(--text4)' }}>{row.errors.length ? row.errors.join('; ') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={resetAll} className="aw-btn" style={{
                  background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)',
                  padding: '12px 20px', borderRadius: 100, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                }}>Upload a different file</button>
                <button onClick={handleCommit} disabled={committing || preview.valid_count === 0} className="aw-btn" style={{
                  background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
                  padding: '12px 20px', borderRadius: 100, fontSize: 13.5, fontWeight: 600,
                  opacity: (committing || preview.valid_count === 0) ? 0.6 : 1,
                  cursor: (committing || preview.valid_count === 0) ? 'default' : 'pointer',
                }}>{committing ? 'Committing…' : `Commit ${preview.valid_count} valid row(s)`}</button>
              </div>
            </>
          )}
        </>
      )}

      {commitResult && (
        <>
          <div className="aw-grid-2" style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
            <MiniStat label="Created" value={commitResult.created_count} color="var(--green)" />
            <MiniStat label="Skipped" value={commitResult.skipped_count} color="var(--red)" />
          </div>

          {commitResult.skipped.length > 0 && (
            <div style={{ overflowX: 'auto', marginBottom: 18, border: '1px solid var(--border)', borderRadius: 12 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
                <thead><tr><th style={thStyle}>Row</th><th style={thStyle}>Errors</th></tr></thead>
                <tbody>
                  {commitResult.skipped.map(s => (
                    <tr key={s.row_num}><td style={tdStyle}>{s.row_num}</td><td style={{ ...tdStyle, color: 'var(--red)' }}>{s.errors.join('; ')}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button onClick={() => { resetAll(); onImported(); }} className="aw-btn" style={{
            background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
            padding: '12px 22px', borderRadius: 100, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
          }}>Done</button>
        </>
      )}
    </div>
  );
}

const PANEL_LABEL_STYLE = { fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' };

function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getMyStats()
      .then(data => { if (!cancelled) setStats(data); })
      .catch(err => { if (!cancelled) setError(err.message || 'Could not load stats.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="aw-surface" style={{ borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
          <Skeleton width={140} height={13} />
        </div>
        <div className="aw-grid-5" style={{ display: 'grid', borderBottom: '1px solid var(--border)' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ padding: 14, borderRight: i < 4 ? '1px solid var(--border)' : 'none' }}>
              <Skeleton width="70%" height={10} style={{ marginBottom: 8 }} />
              <Skeleton width="50%" height={17} />
            </div>
          ))}
        </div>
        <div style={{ padding: 18 }}>
          <Skeleton width="100%" height={100} />
        </div>
      </div>
    );
  }

  if (error) return <div style={{ color: 'var(--red)', fontSize: 13.5, padding: '20px 0' }}>{error}</div>;
  if (!stats) return null;

  const donutData = Object.entries(stats.orders_by_status).map(([status, count]) => ({
    label: status.replace('_', ' '), count, pct: 0, color: STATUS_CHART_COLORS[status] || '#64748B',
  }));
  const totalOrders = donutData.reduce((sum, d) => sum + d.count, 0);
  donutData.forEach(d => { d.pct = totalOrders ? (d.count / totalOrders) * 100 : 0; });

  const sparkValues = stats.sales_last_30_days.map(d => d.revenue_usd);

  const KPIS = [
    { label: 'Total Products', value: stats.total_listings.toLocaleString() },
    { label: 'Inventory Value', value: `$${stats.inventory_value_usd.toLocaleString()}` },
    { label: 'Active Listings', value: stats.active_listings.toLocaleString() },
    { label: 'Sold Listings', value: stats.sold_listings.toLocaleString() },
    { label: 'Pending Orders', value: stats.pending_orders.toLocaleString() },
  ];

  return (
    <div className="aw-surface" style={{ borderRadius: 20, overflow: 'hidden' }}>
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--violet)' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Seller Overview</span>
        </div>
        <div style={{
          fontSize: 11, color: 'var(--text3)', background: 'var(--surface)', padding: '4px 10px',
          borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Calendar size={12} /> Last 30 days
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', borderBottom: '1px solid var(--border)' }}>
        {KPIS.map((k, i) => (
          <div key={k.label} style={{ padding: 14, borderRight: i < KPIS.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4, fontWeight: 500 }}>{k.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 400, color: 'var(--text)', lineHeight: 1 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="seller-overview-charts" style={{ display: 'grid' }}>
        <div style={{ padding: 18, borderRight: '1px solid var(--border)' }}>
          <div style={PANEL_LABEL_STYLE}>Orders by Status</div>
          {totalOrders === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>No orders yet.</div>
          ) : (
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <DonutChart data={donutData} centerValue={totalOrders} centerLabel="Orders" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {donutData.map(d => (
                  <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'capitalize' }}>{d.label}</div>
                      <div style={{ fontSize: 10, color: 'var(--text)', fontWeight: 600 }}>{d.count}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: 18, borderRight: '1px solid var(--border)' }}>
          <div style={PANEL_LABEL_STYLE}>Sales Over Time</div>
          <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 6 }}>Revenue (USD) — last 30 days</div>
          <Sparkline data={sparkValues.length ? sparkValues : [0, 0]} color="#8B7CF6" width={220} height={60} />
        </div>

        <div style={{ padding: 18 }}>
          <div style={PANEL_LABEL_STYLE}>Top Listings by Revenue</div>
          {stats.top_listings.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>No sales yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stats.top_listings.map(l => (
                <div key={l.listing_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: 'var(--text2)' }}>{l.title}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)' }}>${l.revenue_usd.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  const { sellerProfile, refreshSellerProfile } = useAuth();
  const [tab, setTab] = useState('overview');
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shippingId, setShippingId] = useState(null);
  const [shipError, setShipError] = useState({ id: null, message: '' });
  const [trackingDrafts, setTrackingDrafts] = useState({});
  const [trackingSavingId, setTrackingSavingId] = useState(null);
  const [trackingError, setTrackingError] = useState({ id: null, message: '' });

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
    await deleteListing(id);
  }

  async function handleShip(orderId) {
    setShippingId(orderId);
    setShipError({ id: null, message: '' });
    try {
      await markShipped(orderId);
      await loadData();
    } catch (err) {
      setShipError({ id: orderId, message: err.message || 'Could not mark as shipped.' });
    } finally {
      setShippingId(null);
    }
  }

  async function handleSaveTracking(orderId) {
    const value = (trackingDrafts[orderId] || '').trim();
    if (!value) return;
    setTrackingSavingId(orderId);
    setTrackingError({ id: null, message: '' });
    try {
      await recordTracking(orderId, value);
      await loadData();
    } catch (err) {
      setTrackingError({ id: orderId, message: err.message || 'Could not save tracking number.' });
    } finally {
      setTrackingSavingId(null);
    }
  }

  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'listings', label: 'Listings', icon: Package },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
  ];

  const listingColumns = [
    {
      key: 'title', header: 'Listing',
      render: (listing) => (
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{listing.title}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text4)', marginTop: 2 }}>{listing.status}</div>
        </div>
      ),
    },
    { key: 'price', header: 'Price', render: (listing) => `$${listing.price_amount.toLocaleString()}` },
    { key: 'quantity', header: 'Qty' },
    {
      key: 'actions', header: '',
      render: (listing) => (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
          <button onClick={() => { setEditing({ ...listing, price_amount: String(listing.price_amount) }); setShowForm(true); }} style={iconBtnStyle}><Pencil size={14} /></button>
          <ConfirmButton icon={Trash2} confirmLabel="Delete this listing?" onConfirm={() => handleDelete(listing.id)} onDone={loadData} />
        </div>
      ),
    },
  ];

  const orderColumns = [
    {
      key: 'item', header: 'Order',
      render: (item) => (
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{item.title_snapshot} × {item.quantity}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text4)', marginTop: 2 }}>buyer: {item.buyer_name || 'unknown'}</div>
        </div>
      ),
    },
    {
      key: 'status', header: 'Status',
      render: (item) => (
        <div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6, textTransform: 'capitalize' }}>{item.order_status.replace('_', ' ')}</div>
          <OrderTracker status={item.order_status} compact />
        </div>
      ),
    },
    {
      key: 'tracking', header: 'Tracking',
      render: (item) => {
        if (!['shipped', 'delivered', 'released'].includes(item.order_status)) return <span style={{ color: 'var(--text4)' }}>—</span>;
        if (item.tracking_number) {
          return <strong style={{ fontSize: 12.5, color: 'var(--text)' }}>{item.tracking_number}</strong>;
        }
        return (
          <div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                placeholder="Tracking #"
                value={trackingDrafts[item.order_id] || ''}
                onChange={e => setTrackingDrafts(d => ({ ...d, [item.order_id]: e.target.value }))}
                style={{ ...inputStyle, width: 130, padding: '6px 10px', fontSize: 12 }}
              />
              <button
                onClick={() => handleSaveTracking(item.order_id)}
                disabled={trackingSavingId === item.order_id || !(trackingDrafts[item.order_id] || '').trim()}
                style={{
                  background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)',
                  padding: '6px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                  opacity: trackingSavingId === item.order_id ? 0.6 : 1, cursor: trackingSavingId === item.order_id ? 'default' : 'pointer',
                }}
              >{trackingSavingId === item.order_id ? '…' : 'Save'}</button>
            </div>
            {trackingError.id === item.order_id && (
              <div style={{ fontSize: 11.5, color: 'var(--red)', marginTop: 4 }}>{trackingError.message}</div>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions', header: '',
      render: (item) => (
        <div style={{ textAlign: 'right' }}>
          {item.order_status === 'paid' && (
            <button onClick={() => handleShip(item.order_id)} disabled={shippingId === item.order_id} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--surface2)', border: '1px solid var(--border)',
              color: 'var(--text)', padding: '8px 14px', borderRadius: 100, fontSize: 12.5, fontWeight: 500,
              opacity: shippingId === item.order_id ? 0.6 : 1, cursor: shippingId === item.order_id ? 'default' : 'pointer',
            }}><Truck size={13} /> {shippingId === item.order_id ? 'Marking…' : 'Mark shipped'}</button>
          )}
          {shipError.id === item.order_id && (
            <div style={{ fontSize: 11.5, color: 'var(--red)', marginTop: 6 }}>{shipError.message}</div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader eyebrow="Your account" title="Seller" titleItalic="dashboard" />
      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          {!sellerProfile && <ApplyForm onApplied={refreshSellerProfile} />}

          {sellerProfile?.kyb_status === 'pending' && (
            <div className="aw-surface" style={{ borderRadius: 18, padding: 28, maxWidth: 480 }}>
              <Clock size={20} color="var(--amber)" style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Application under review</h3>
              <p style={{ fontSize: 13.5, color: 'var(--text3)', lineHeight: 1.6 }}>
                Thanks for applying to sell on AssetWave. Our team is reviewing <strong>{sellerProfile.org_name}</strong>. You'll be able to list equipment once approved.
              </p>
            </div>
          )}

          {(sellerProfile?.kyb_status === 'rejected' || sellerProfile?.kyb_status === 'suspended') && (
            <div className="aw-surface" style={{ borderRadius: 18, padding: 28, maxWidth: 480 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--red)', marginBottom: 6 }}>
                {sellerProfile.kyb_status === 'rejected' ? 'Application not approved' : 'Seller account suspended'}
              </h3>
              {sellerProfile.kyb_notes && <p style={{ fontSize: 13.5, color: 'var(--text3)' }}>{sellerProfile.kyb_notes}</p>}
            </div>
          )}

          {isApproved && (
            <div className="seller-dashboard-layout" style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
              <nav className="seller-dashboard-nav" style={{
                width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 100,
              }}>
                {TABS.map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                    padding: '10px 14px', borderRadius: 10, fontSize: 13.5, fontWeight: 500, border: 'none',
                    background: tab === t.id ? 'var(--surface3)' : 'transparent',
                    color: tab === t.id ? 'var(--text)' : 'var(--text3)',
                  }}>
                    <t.icon size={15} /> {t.label}
                  </button>
                ))}
              </nav>

              <div style={{ flex: 1, minWidth: 0 }}>
                {tab === 'overview' && <OverviewTab />}

                {tab === 'listings' && (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                      <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>Your listings</h3>
                      {!showForm && !showBulk && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => setShowBulk(true)} className="aw-btn" style={{
                            display: 'flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'var(--text)',
                            border: '1px solid var(--border)', padding: '10px 18px', borderRadius: 100, fontSize: 13.5, fontWeight: 600,
                          }}><Upload size={15} /> Bulk upload</button>
                          <button onClick={() => { setEditing(null); setShowForm(true); }} className="aw-btn" style={{
                            display: 'flex', alignItems: 'center', gap: 8, background: 'var(--inverse-bg)', color: 'var(--inverse-text)',
                            border: 'none', padding: '10px 18px', borderRadius: 100, fontSize: 13.5, fontWeight: 600,
                          }}><Plus size={15} /> New listing</button>
                        </div>
                      )}
                    </div>

                    {showBulk && (
                      <BulkImportPanel
                        onCancel={() => setShowBulk(false)}
                        onImported={() => { setShowBulk(false); loadData(); }}
                      />
                    )}

                    {showForm && (
                      <ListingForm
                        categories={categories}
                        initial={editing}
                        onCancel={() => setShowForm(false)}
                        onSaved={() => { setShowForm(false); loadData(); }}
                      />
                    )}

                    {loading ? (
                      <div className="aw-surface" style={{ borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                            <div style={{ flex: 1 }}>
                              <Skeleton width="45%" height={14} style={{ marginBottom: 8 }} />
                              <Skeleton width="30%" height={12} />
                            </div>
                            <Skeleton width={64} height={32} radius={8} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Table columns={listingColumns} rows={listings} emptyMessage="You haven't listed any equipment yet." />
                    )}
                  </>
                )}

                {tab === 'orders' && (
                  <>
                    <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 20 }}>Orders on your items</h3>
                    <Table columns={orderColumns} rows={orders} rowKey="order_item_id" emptyMessage="No orders yet." />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .seller-overview-charts { grid-template-columns: 1fr 1.4fr 1fr; }
        @media (max-width: 900px) {
          .seller-overview-charts { grid-template-columns: 1fr; }
          .seller-overview-charts > div { border-right: none !important; border-bottom: 1px solid var(--border); }
          .seller-overview-charts > div:last-child { border-bottom: none; }
        }
        @media (max-width: 768px) {
          .seller-dashboard-layout { flex-direction: column; }
          .seller-dashboard-nav { width: 100%; flex-direction: row; overflow-x: auto; position: static; top: auto; }
        }
      `}</style>
    </>
  );
}
