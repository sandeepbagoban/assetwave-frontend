import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useListings } from '../hooks/useListings';
import PageHeader from '../components/shared/PageHeader';
import CtaBanner from '../components/home/CtaBanner';

const CATEGORIES = [
  { id: '', label: 'All equipment' },
  { id: 'transmitters', label: 'Transmitters' },
  { id: 'cameras', label: 'Cameras' },
  { id: 'audio', label: 'Audio' },
  { id: 'satellite', label: 'Satellite' },
  { id: 'lighting', label: 'Lighting' },
];

const CONDITION_STYLE = {
  excellent: { bg: 'rgba(74,222,128,0.12)', color: '#4ADE80' },
  good: { bg: 'rgba(125,211,232,0.12)', color: '#7DD3E8' },
  fair: { bg: 'rgba(251,191,36,0.12)', color: '#FBBF24' },
};

function ListingCard({ listing }) {
  const cond = CONDITION_STYLE[listing.condition] || CONDITION_STYLE.good;
  const savingPct = listing.new_price_estimate
    ? Math.round((1 - listing.price_amount / listing.new_price_estimate) * 100)
    : null;

  return (
    <Link to={`/marketplace/${listing.id}`} style={{
      display: 'block', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 18,
      overflow: 'hidden', transition: 'all .25s', cursor: 'pointer',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--violet)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
      <div style={{
        height: 180, background: 'linear-gradient(160deg, #1A1430, #0F0F1A)',
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          position: 'absolute', top: 12, left: 12,
          fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
          padding: '4px 10px', borderRadius: 100,
          background: cond.bg, color: cond.color,
        }}>{listing.condition}</span>
        <svg width="56" height="56" viewBox="0 0 56 56" opacity="0.5">
          <circle cx="28" cy="28" r="26" stroke="url(#cardicon)" strokeWidth="1.2" />
          <circle cx="28" cy="28" r="8" fill="url(#cardicon)" opacity="0.5" />
          <defs><linearGradient id="cardicon" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#B4A9FB"/><stop offset="1" stopColor="#7DD3E8"/></linearGradient></defs>
        </svg>
      </div>
      <div style={{ padding: '18px 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text3)', marginBottom: 10 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }} />
          {listing.seller.name}
          {listing.seller.verified && <ShieldCheck size={12} color="var(--violet3)" />}
        </div>
        <h3 style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text)', marginBottom: 4, lineHeight: 1.35 }}>{listing.title}</h3>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>{listing.year_manufactured} &middot; {listing.origin_country}</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            {listing.new_price_estimate && (
              <div style={{ fontSize: 11.5, color: 'var(--text4)', textDecoration: 'line-through' }}>${listing.new_price_estimate.toLocaleString()}</div>
            )}
            <div className="serif" style={{ fontSize: 22, color: 'var(--text)' }}>${listing.price_amount.toLocaleString()}</div>
          </div>
          {savingPct !== null && (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#4ADE80', background: 'rgba(74,222,128,0.12)', padding: '3px 8px', borderRadius: 6 }}>
              -{savingPct}%
            </span>
          )}
        </div>
      </div>
      <div style={{
        padding: '10px 18px', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 11, color: 'var(--text3)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--violet3)', fontWeight: 500 }}>
          <ShieldCheck size={12} /> Escrow protected
        </span>
        <ArrowUpRight size={13} />
      </div>
    </Link>
  );
}

export default function Marketplace() {
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const { data: listings, loading, error } = useListings(category ? { category } : {});

  const filtered = listings.filter(l =>
    !query || l.title.toLowerCase().includes(query.toLowerCase()) || l.brand.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="Professional gear,"
        titleItalic="verified sellers"
        desc="Every listing comes from a KYB-verified broadcaster or media company. Every payment is escrow-protected until you confirm receipt."
      />

      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container">
          {/* Search + filter bar */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
            <div style={{
              flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 100,
              padding: '12px 18px',
            }}>
              <Search size={16} color="var(--text3)" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search transmitters, cameras, mixing consoles..."
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 14 }}
              />
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 100,
              padding: '12px 20px', color: 'var(--text2)', fontSize: 14, fontWeight: 500,
            }}>
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)} style={{
                padding: '9px 18px', borderRadius: 100, fontSize: 13.5, fontWeight: 500,
                border: '1px solid ' + (category === c.id ? 'var(--violet)' : 'var(--border)'),
                background: category === c.id ? 'var(--surface3)' : 'transparent',
                color: category === c.id ? 'var(--text)' : 'var(--text3)',
                transition: 'all .2s',
              }}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Results */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)', fontSize: 14 }}>
              Loading listings&hellip;
            </div>
          )}
          {error && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--red)', fontSize: 14 }}>
              Couldn't load listings: {error}
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)', fontSize: 14 }}>
              No listings match your search yet.
            </div>
          )}
          {!loading && !error && filtered.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {filtered.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
