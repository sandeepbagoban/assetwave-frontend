import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, ShieldCheck, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useListings } from '../hooks/useListings';
import PageHeader from '../components/shared/PageHeader';
import CtaBanner from '../components/home/CtaBanner';
import { ErrorBlock, EmptyBlock } from '../components/shared/ui/AsyncBlocks';
import Skeleton from '../components/shared/ui/Skeleton';

const CONDITIONS = [
  { id: '', label: 'Any condition' },
  { id: 'excellent', label: 'Excellent' },
  { id: 'good', label: 'Good' },
  { id: 'fair', label: 'Fair' },
];

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
    <Link to={`/marketplace/${listing.id}`} className="aw-card" style={{
      display: 'block', borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
    }}>
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
        <span title="Simulated for this demo — no real payment is captured" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--violet3)', fontWeight: 500, cursor: 'help' }}>
          <ShieldCheck size={12} /> Escrow protected (demo)
        </span>
        <ArrowUpRight size={13} />
      </div>
    </Link>
  );
}

function ListingCardSkeleton() {
  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 18, overflow: 'hidden' }}>
      <Skeleton height={180} radius={0} />
      <div style={{ padding: '18px 18px 16px' }}>
        <Skeleton width={110} height={11} style={{ marginBottom: 12 }} />
        <Skeleton width="85%" height={15} style={{ marginBottom: 8 }} />
        <Skeleton width="50%" height={12} style={{ marginBottom: 18 }} />
        <Skeleton width={90} height={22} />
      </div>
      <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)' }}>
        <Skeleton width={130} height={11} />
      </div>
    </div>
  );
}

export default function Marketplace() {
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [condition, setCondition] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Any filter change resets to page 1 — otherwise a narrower result set
  // could leave the user stranded on a page that no longer exists.
  useEffect(() => { setPage(1); }, [category, debouncedQuery, condition, minPrice, maxPrice]);

  const params = {
    ...(category && { category }),
    ...(debouncedQuery && { q: debouncedQuery }),
    ...(condition && { condition }),
    ...(minPrice && { min_price: minPrice }),
    ...(maxPrice && { max_price: maxPrice }),
    page,
    limit,
  };
  const { data: listings, meta, loading, error } = useListings(params);
  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / limit)) : 1;

  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="Professional gear,"
        titleItalic="verified sellers"
        desc="Every listing comes from a KYB-verified broadcaster or media company. This demo simulates escrow-protected payments end-to-end."
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
            <button onClick={() => setShowFilters(v => !v)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: showFilters ? 'var(--surface3)' : 'var(--bg3)',
              border: '1px solid ' + (showFilters ? 'var(--violet)' : 'var(--border)'),
              borderRadius: 100, padding: '12px 20px', color: 'var(--text2)', fontSize: 14, fontWeight: 500,
            }}>
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>

          {showFilters && (
            <div style={{
              display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end',
              background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 16,
              padding: 20, marginBottom: 24,
            }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>Condition</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {CONDITIONS.map(c => (
                    <button key={c.id} onClick={() => setCondition(c.id)} style={{
                      padding: '7px 14px', borderRadius: 100, fontSize: 12.5, fontWeight: 500,
                      border: '1px solid ' + (condition === c.id ? 'var(--violet)' : 'var(--border)'),
                      background: condition === c.id ? 'var(--surface3)' : 'transparent',
                      color: condition === c.id ? 'var(--text)' : 'var(--text3)',
                    }}>{c.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>Min price ($)</div>
                <input type="number" min="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="0" style={{
                  width: 110, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '8px 12px', color: 'var(--text)', fontSize: 13, outline: 'none',
                }} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>Max price ($)</div>
                <input type="number" min="0" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Any" style={{
                  width: 110, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8,
                  padding: '8px 12px', color: 'var(--text)', fontSize: 13, outline: 'none',
                }} />
              </div>
              {(condition || minPrice || maxPrice) && (
                <button onClick={() => { setCondition(''); setMinPrice(''); setMaxPrice(''); }} style={{
                  background: 'none', border: 'none', color: 'var(--violet3)', fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
                }}>Clear filters</button>
              )}
            </div>
          )}

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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {Array.from({ length: 8 }).map((_, i) => <ListingCardSkeleton key={i} />)}
            </div>
          )}
          {error && <ErrorBlock message={error} prefix="Couldn't load listings" />}
          {!loading && !error && listings.length === 0 && (
            <EmptyBlock message="No listings match your search yet." />
          )}
          {!loading && !error && listings.length > 0 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                {listings.map(l => <ListingCard key={l.id} listing={l} />)}
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 40 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} style={{
                    display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg3)', border: '1px solid var(--border)',
                    borderRadius: 100, padding: '8px 16px', color: 'var(--text2)', fontSize: 13,
                    opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? 'default' : 'pointer',
                  }}><ChevronLeft size={14} /> Prev</button>
                  <span style={{ fontSize: 13, color: 'var(--text3)' }}>Page {page} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{
                    display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg3)', border: '1px solid var(--border)',
                    borderRadius: 100, padding: '8px 16px', color: 'var(--text2)', fontSize: 13,
                    opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? 'default' : 'pointer',
                  }}>Next <ChevronRight size={14} /></button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
