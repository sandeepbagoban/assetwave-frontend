import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Brand } from '../../components/shared/Navbar';
import { formatPrice } from '../../lib/format';
import CountrySelect from '../../components/shared/CountrySelect';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, ArrowUpRight, LogOut, ExternalLink, Store, Plus, Trash2, Pencil, Truck, Clock, X, Upload, Calendar, LayoutDashboard, Package, ClipboardList } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { applyAsSeller, getMyListings, getMySellerOrders, getMyStats } from '../../lib/api/sellers';
import { createListing, updateListing, deleteListing, addListingImages } from '../../lib/api/listings';
import { previewSellerImport, commitSellerImport, SELLER_IMPORT_COLUMNS } from '../../lib/api/sellerImports';
import { markShipped, recordTracking } from '../../lib/api/orders';
import { getCategories } from '../../lib/api/categories';
import ImagePicker from '../../components/shared/ui/ImagePicker';
import ConfirmButton from '../../components/shared/ui/ConfirmButton';
import Skeleton from '../../components/shared/ui/Skeleton';
import { Sparkline } from '../../components/shared/ui/charts';
import Table from '../../components/shared/ui/Table';
import { iconBtnStyle, inputStyle as baseInputStyle, labelStyle as baseLabelStyle } from '../../components/shared/ui/styles';

const inputStyle = { ...baseInputStyle, background: 'var(--bg2)', padding: '10px 14px', fontSize: 13.5 };
const labelStyle = { ...baseLabelStyle, fontSize: 12, marginBottom: 6 };

const EMPTY_FORM = {
  title: '', category_id: '', brand: '', model: '', year_manufactured: '', condition: 'good',
  description: '', price_amount: '', currency: 'USD', equipment_location: '', origin_country: '', new_price_estimate: '', quantity: 1,
  weight_kg: '', length_cm: '', width_cm: '', height_cm: '',
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
          <label htmlFor="field-organization-business-name" style={labelStyle}>Organization / business name</label>
          <input id="field-organization-business-name" style={inputStyle} required value={form.org_name} onChange={e => setForm(f => ({ ...f, org_name: e.target.value }))} />
          <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 6 }}>Kept private — never shown to buyers.</div>
        </div>
        <div>
          <label htmlFor="field-public-nickname" style={labelStyle}>Public nickname</label>
          <input id="field-public-nickname" style={inputStyle} required value={form.nickname} onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))} placeholder="Shown to buyers instead of your company name" />
        </div>
        <div className="aw-grid-2" style={{ display: 'grid', gap: 12 }}>
          <div>
            <label style={labelStyle}>Country</label>
            <CountrySelect style={inputStyle} required  value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value.toUpperCase() }))} />
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
          <label htmlFor="field-registration-number-optional" style={labelStyle}>Registration number (optional)</label>
          <input id="field-registration-number-optional" style={inputStyle} value={form.registration_no} onChange={e => setForm(f => ({ ...f, registration_no: e.target.value }))} />
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
      price_amount: form.price_amount === '' || form.price_amount == null ? null : Number(form.price_amount),
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
          <label htmlFor="field-title" style={labelStyle}>Title</label>
          <input id="field-title" style={inputStyle} required value={form.title} onChange={update('title')} />
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
          <label htmlFor="field-brand" style={labelStyle}>Brand</label>
          <input id="field-brand" style={inputStyle} value={form.brand} onChange={update('brand')} />
        </div>
        <div>
          <label htmlFor="field-model" style={labelStyle}>Model</label>
          <input id="field-model" style={inputStyle} value={form.model} onChange={update('model')} />
        </div>
        <div>
          <label htmlFor="field-year-manufactured" style={labelStyle}>Year manufactured</label>
          <input id="field-year-manufactured" style={inputStyle} type="number" value={form.year_manufactured} onChange={update('year_manufactured')} />
        </div>
        <div>
          <label htmlFor="field-origin-country-2-letter" style={labelStyle}>Origin country</label>
          <CountrySelect aria-label="Origin country" style={inputStyle} value={form.origin_country || ''} onChange={update('origin_country')} />
        </div>
        <div>
          <label style={labelStyle}>Currency</label>
          <select style={inputStyle} value={form.currency} onChange={update('currency')}>{['USD','EUR','GBP','MUR','ZAR','AED','INR','AUD','CAD','CHF','SGD','JPY'].map(c => <option key={c} value={c}>{c}</option>)}</select>
        </div><div><label style={labelStyle}>Equipment location</label><CountrySelect aria-label="Equipment location" style={inputStyle} value={form.equipment_location || ''} onChange={update('equipment_location')} /></div><div>
          <label htmlFor="field-price-optional-leave-blank-for-price-on-request" style={labelStyle}>Price (optional; leave blank for price on request)</label>
          <input id="field-price-optional-leave-blank-for-price-on-request" style={inputStyle} type="number" min="0.01" step="0.01" value={form.price_amount ?? ''} onChange={update('price_amount')} />
        </div>
        <div>
          <label htmlFor="field-new-price-estimate-optional" style={labelStyle}>New price estimate (optional)</label>
          <input id="field-new-price-estimate-optional" style={inputStyle} type="number" min="0" step="0.01" value={form.new_price_estimate} onChange={update('new_price_estimate')} />
        </div>
        <div>
          <label htmlFor="field-quantity" style={labelStyle}>Quantity</label>
          <input id="field-quantity" style={inputStyle} type="number" min="1" value={form.quantity} onChange={update('quantity')} />
        </div>
        <div>
          <label htmlFor="field-weight-kg-optional" style={labelStyle}>Weight (kg, optional)</label>
          <input id="field-weight-kg-optional" style={inputStyle} type="number" min="0" step="0.01" value={form.weight_kg} onChange={update('weight_kg')} />
        </div>
        <div className="aw-grid-3" style={{ display: 'grid', gap: 8 }}>
          <div>
            <label htmlFor="field-length-cm" style={labelStyle}>Length (cm)</label>
            <input id="field-length-cm" style={inputStyle} type="number" min="0" step="0.1" value={form.length_cm} onChange={update('length_cm')} />
          </div>
          <div>
            <label htmlFor="field-width-cm" style={labelStyle}>Width (cm)</label>
            <input id="field-width-cm" style={inputStyle} type="number" min="0" step="0.1" value={form.width_cm} onChange={update('width_cm')} />
          </div>
          <div>
            <label htmlFor="field-height-cm" style={labelStyle}>Height (cm)</label>
            <input id="field-height-cm" style={inputStyle} type="number" min="0" step="0.1" value={form.height_cm} onChange={update('height_cm')} />
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
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Bulk upload listings</h3><a href="/AWXchange_Inventory_Template.xlsx" download>Download template</a>
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

function OverviewTab({ listings, onNavigate }) {
 const [stats,setStats]=useState(null);const [error,setError]=useState('');
 useEffect(()=>{let active=true;getMyStats().then(data=>{if(active)setStats(data);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;};},[]);
 const kpis=[['Active listings',stats?.active_listings,'Available to buyers'],['USD-priced inventory',stats?formatPrice(stats.inventory_value_usd,'USD'):null,'Excludes unpriced and other currencies'],['Pending orders',stats?.pending_orders,'Orders in progress'],['Completed sales',stats?.sold_listings,'Equipment sold']];
 const days=stats?.sales_last_30_days||[];const hasSales=days.some(d=>d.revenue_usd>0);
 return <div className="workspace-overview">
 {error&&<div className="workspace-error" role="alert">Could not load overview: {error}</div>}
 <div className="metric-grid">{kpis.map(([label,value,note],i)=><article className="metric-card" key={label}><div className="metric-card__label">{label}<span className="metric-card__icon">{i===0?<Package size={17}/>:i===2?<Clock size={17}/>:<Store size={17}/>}</span></div><strong>{value??'—'}</strong><p>{note}</p></article>)}</div>
 <div className="workspace-two-col"><section className="workspace-panel"><div className="workspace-panel__heading"><div><h2>Sales performance</h2><p>Revenue from your orders in USD</p></div><span className="period-label"><Calendar size={14}/> Last 30 days</span></div>
 {hasSales?<><div className="sales-total">{formatPrice(days.reduce((sum,d)=>sum+Number(d.revenue_usd||0),0),'USD')}<span> Revenue over the last 30 days</span></div><div className="workspace-chart"><Sparkline data={days.map(d=>d.revenue_usd)} color="#16846c" width={600} height={160}/></div><div className="chart-axis"><span>{days[0]?.date}</span><span>{days.at(-1)?.date}</span></div></>:<div className="chart-empty"><div className="chart-empty-icon"><LayoutDashboard size={28}/></div><strong>{stats?'Your sales story starts here':'Loading sales performance'}</strong><p>{stats?'Completed order activity will appear here.':'Your account figures are being retrieved.'}</p></div>}
 </section><section className="workspace-panel"><div className="workspace-panel__heading"><div><h2>Your next steps</h2><p>Keep your inventory ready for buyers</p></div></div><button className="workspace-task" onClick={()=>onNavigate('listings')}><span className="task-icon"><Package size={18}/></span><span><strong>Manage your listings</strong><small>Check pricing, condition and availability</small></span><ArrowUpRight size={17}/></button><button className="workspace-task" onClick={()=>onNavigate('uploads')}><span className="task-icon"><Upload size={18}/></span><span><strong>Upload your inventory</strong><small>Add multiple items with the Excel template</small></span><ArrowUpRight size={17}/></button><button className="workspace-task" onClick={()=>onNavigate('orders')}><span className="task-icon"><Truck size={18}/></span><span><strong>Review your orders</strong><small>Coordinate delivery with AWXchange</small></span><ArrowUpRight size={17}/></button><div className="workspace-help"><strong>Need a hand?</strong><p>Our team can help you prepare your inventory or manage a deal.</p><Link to="/contact">Contact seller support →</Link></div></section></div>
 <section className="workspace-panel"><div className="workspace-panel__heading"><div><h2>Recent inventory</h2><p>Your latest equipment listings</p></div><button className="text-link" onClick={()=>onNavigate('listings')}>View inventory <ArrowUpRight size={15}/></button></div>{listings.length?<div className="recent-list">{listings.slice(0,4).map(l=><div className="recent-list__row" key={l.id}><span className="equipment-icon"><Package size={19}/></span><div><strong>{l.title}</strong><small>{l.brand} {l.model}</small></div><span className={`status-tag status-tag--${l.status}`}>{l.status}</span><strong>{formatPrice(l.price_amount,l.currency)}</strong></div>)}</div>:<div className="workspace-empty"><Package size={30}/><h3>Your inventory starts here</h3><p>Add your first item or upload an Excel inventory to start selling.</p><button className="button" onClick={()=>onNavigate('listings')}>Manage inventory</button></div>}</section>
 </div>;
}

export default function SellerDashboard() {
 const {user,sellerProfile,refreshSellerProfile,logout}=useAuth();const navigate=useNavigate();const [params,setParams]=useSearchParams();
 const tab=['overview','listings','uploads','orders'].includes(params.get('view'))?params.get('view'):'overview';
 const [categories,setCategories]=useState([]);const [listings,setListings]=useState([]);const [orders,setOrders]=useState([]);const [loading,setLoading]=useState(false);const [loadError,setLoadError]=useState('');
 const [showForm,setShowForm]=useState(false);const [editing,setEditing]=useState(null);const [search,setSearch]=useState('');const [status,setStatus]=useState('');const [actionError,setActionError]=useState('');
 const [listingPage,setListingPage]=useState(1);const [listingMeta,setListingMeta]=useState(null);const [debouncedSearch,setDebouncedSearch]=useState('');
 useEffect(()=>{const timer=setTimeout(()=>{setDebouncedSearch(search);setListingPage(1);},250);return()=>clearTimeout(timer);},[search]);
 const [shippingId,setShippingId]=useState(null);const [tracking,setTracking]=useState({});
 const isApproved=sellerProfile?.kyb_status==='approved';
 const go=next=>{setParams({view:next});setShowForm(false);setActionError('');setSearch('');setStatus('');setListingPage(1);};
 const dataVersion=useRef(0);
 const loadData=useCallback(async()=>{
  if(!isApproved)return;const version=++dataVersion.current;setLoading(true);setLoadError('');
  try{const [cats,inventory,sales]=await Promise.all([getCategories(),getMyListings({limit:20,page:listingPage,...(debouncedSearch?{q:debouncedSearch}:{}),...(status?{status}: {})}),getMySellerOrders({limit:100})]);if(version!==dataVersion.current)return;setCategories(cats);setListings(inventory.data);setListingMeta(inventory.meta);setOrders(sales.data);}catch(e){if(version===dataVersion.current)setLoadError(e.message||'Could not retrieve seller data.');}finally{if(version===dataVersion.current)setLoading(false);}
 },[isApproved,listingPage,debouncedSearch,status]);useEffect(()=>{loadData();},[loadData]);
 const tabs=[{id:'overview',label:'Overview',icon:LayoutDashboard},{id:'listings',label:'Listings',icon:Package},{id:'uploads',label:'Inventory uploads',icon:Upload},{id:'orders',label:'Orders',icon:ClipboardList}];
 const active=tabs.find(t=>t.id===tab);const filtered=listings;
 async function ship(id){setShippingId(id);setActionError('');try{await markShipped(id);await loadData();}catch(e){setActionError(e.message);}finally{setShippingId(null);}}
 async function saveTracking(id){setShippingId(id);setActionError('');try{await recordTracking(id,tracking[id]);await loadData();}catch(e){setActionError(e.message);}finally{setShippingId(null);}}
 const listingColumns=[{key:'title',header:'Equipment',render:l=><div className="inventory-title"><span className="equipment-icon"><Package size={18}/></span><div><strong>{l.title}</strong><small>{[l.brand,l.model].filter(Boolean).join(' · ')||'Equipment listing'}</small></div></div>},{key:'status',header:'Status',render:l=><span className={`status-tag status-tag--${l.status}`}>{l.status}</span>},{key:'condition',header:'Condition',render:l=><span style={{textTransform:'capitalize'}}>{l.condition}</span>},{key:'price',header:'Asking price',render:l=>formatPrice(l.price_amount,l.currency)},{key:'quantity',header:'Qty'},{key:'actions',header:'Actions',render:l=><div className="row-actions"><button title={`Edit ${l.title}`} aria-label={`Edit ${l.title}`} style={iconBtnStyle} onClick={()=>{setEditing({...l,price_amount:l.price_amount==null?'':String(l.price_amount)});setShowForm(true);}}><Pencil size={15}/></button><ConfirmButton icon={Trash2} confirmLabel="Delete this listing?" onConfirm={()=>deleteListing(l.id)} onDone={loadData}/></div>}];
 const orderColumns=[{key:'item',header:'Equipment / order',render:item=><div><strong>{item.title_snapshot}</strong><small className="table-secondary">{item.quantity} units · {item.order_id?.slice(0,8)}</small></div>},{key:'status',header:'Status',render:item=><span className="status-tag">{item.order_status.replaceAll('_',' ')}</span>},{key:'tracking',header:'Delivery tracking',render:item=>item.tracking_number||(['shipped','delivered'].includes(item.order_status)?<div className="tracking-control"><input aria-label="Tracking number" placeholder="Tracking number" value={tracking[item.order_id]||''} onChange={e=>setTracking({...tracking,[item.order_id]:e.target.value})}/><button className="button button--secondary" disabled={!tracking[item.order_id]?.trim()||shippingId===item.order_id} onClick={()=>saveTracking(item.order_id)}>Save</button></div>:'Coordinated by AWXchange')},{key:'actions',header:'Actions',render:item=>item.order_status==='paid'?<button className="button button--secondary" disabled={shippingId===item.order_id} onClick={()=>ship(item.order_id)}>Mark shipped</button>:<Link className="text-link" to={`/orders/${item.order_id}`}>View order</Link>}];
 async function signOut(){await logout();navigate('/login');}
 return <div className="seller-workspace" data-theme="light"><aside className="workspace-sidebar"><Brand subtitle="Seller workspace"/><div className="workspace-sidebar__label">Workspace</div><nav aria-label="Seller navigation">{tabs.map(t=><button key={t.id} className={tab===t.id?'is-active':''} onClick={()=>go(t.id)} aria-current={tab===t.id?'page':undefined}><t.icon size={18}/>{t.label}</button>)}</nav><div className="workspace-sidebar__bottom"><Link to="/marketplace"><ExternalLink size={17}/> Open marketplace</Link><Link to="/contact"><Store size={17}/> Seller support</Link><button onClick={signOut}><LogOut size={17}/> Sign out</button><div className="workspace-account"><span className="account-avatar">{(user?.full_name||'S').slice(0,1)}</span><div><strong>{sellerProfile?.nickname||user?.full_name||'Your account'}</strong><small>{sellerProfile?.kyb_status==='approved'?'Approved seller':'Seller account'}</small></div></div></div></aside>
 <div className="workspace-main"><header className="workspace-topbar"><span>Seller workspace <span className="breadcrumb-divider">/</span> <strong>{active.label}</strong></span><div><span className="workspace-pilot">Pilot programme</span><button className="workspace-mobile-signout" onClick={signOut} aria-label="Sign out"><LogOut size={16}/></button><span className="account-avatar">{(user?.full_name||'S').slice(0,1)}</span></div></header>
 <main className="workspace-content"><div className="workspace-page-heading"><div><p className="workspace-breadcrumb">AWXchange / {active.label}</p><h1>{tab==='overview'?'Overview':tab==='listings'?'Equipment inventory':tab==='uploads'?'Inventory uploads':'Manage your orders'}</h1><p>{tab==='overview'?'Monitor inventory, orders and sales activity.':tab==='listings'?'Keep your listings accurate, up to date and ready for buyers.':tab==='uploads'?'Bring your inventory into AWXchange with a single Excel upload.':'Track order progress and coordinate the next steps with our team.'}</p></div>{isApproved&&<div className="workspace-heading-actions"><button className="button button--secondary" onClick={()=>go('uploads')}><Upload size={16}/> Bulk upload</button><button className="button" onClick={()=>{go('listings');setEditing(null);setShowForm(true);}}><Plus size={17}/> New listing</button></div>}</div>
 {loadError&&<div className="workspace-error" role="alert">{loadError}<button onClick={loadData}>Try again</button></div>}{actionError&&<div className="workspace-error" role="alert">{actionError}</div>}
 {!sellerProfile&&<section className="workspace-panel onboarding-panel"><h2>Set up your seller account</h2><p>Tell us about your business. Our team will review your application before you publish equipment.</p><ApplyForm onApplied={refreshSellerProfile}/></section>}
 {sellerProfile&&!isApproved&&<section className="workspace-panel workspace-empty"><Clock size={34}/><h2>{sellerProfile.kyb_status==='pending'?'Your application is under review':'Your account needs attention'}</h2><p>{sellerProfile.kyb_status==='pending'?`Our team is reviewing ${sellerProfile.org_name}. You can upload inventory once your application is approved.`:sellerProfile.kyb_notes||'Contact AWXchange for help with your seller application.'}</p><Link className="button button--secondary" to="/contact">Contact seller support</Link></section>}
 {isApproved&&<>
 {tab==='overview'&&<OverviewTab listings={listings} onNavigate={go}/>}
 {tab==='uploads'&&<BulkImportPanel onCancel={()=>go('listings')} onImported={()=>{loadData();go('listings');}}/>}
 {tab==='listings'&&<>{showForm&&<ListingForm categories={categories} initial={editing} onCancel={()=>setShowForm(false)} onSaved={()=>{setShowForm(false);loadData();}}/>}<section className="workspace-panel inventory-panel"><div className="inventory-toolbar"><div><h2>All equipment <span className="count-chip">{listingMeta?.total??listings.length}</span></h2><p>Published and unpublished listings</p></div><div className="inventory-filters"><div className="workspace-search"><Search size={16}/><input aria-label="Search inventory" placeholder="Search equipment…" value={search} onChange={e=>setSearch(e.target.value)}/></div><select aria-label="Listing status" value={status} onChange={e=>{setStatus(e.target.value);setListingPage(1);}}><option value="">All statuses</option><option value="active">Active</option><option value="draft">Draft</option><option value="sold">Sold</option><option value="archived">Archived</option></select></div></div>{loading?<div style={{padding:24}}><Skeleton height={160}/></div>:<Table columns={listingColumns} rows={filtered} emptyMessage={search||status?'No equipment matches these filters.':'No listings yet. Add your first piece of equipment above.'}/>}<div className="inventory-pagination"><span>{listingMeta?.total??listings.length} listings · Page {listingPage}</span><div><button className="button button--secondary" disabled={listingPage===1||loading} onClick={()=>setListingPage(p=>p-1)}>Previous</button><button className="button button--secondary" disabled={loading||listingPage*20>=(listingMeta?.total??listings.length)} onClick={()=>setListingPage(p=>p+1)}>Next</button></div></div></section></>}
 {tab==='orders'&&<section className="workspace-panel inventory-panel"><div className="inventory-toolbar"><div><h2>Your orders <span className="count-chip">{orders.length}</span></h2><p>Orders containing your equipment</p></div></div><Table columns={orderColumns} rows={orders} rowKey="order_item_id" emptyMessage="New orders will appear here when buyers choose your equipment."/></section>}
 </>}
 <footer className="workspace-footer"><span>© 2026 AWXchange</span><div><Link to="/terms">Terms of Use</Link><Link to="/privacy">Privacy Policy</Link><Link to="/contact">Get help</Link></div></footer>
 </main></div></div>;
}
