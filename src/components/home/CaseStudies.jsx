import { Search, ArrowUpRight } from 'lucide-react';

const CASES = [
  { tag: 'Sale Optimization', title: 'Average Recovery Value: 35%', sub: 'How MBC liquidated $200K in surplus equipment' },
  { tag: 'Logistics', title: 'Cross-Border Delivery: 8 days avg', sub: 'Freight coordination across 12 African markets' },
  { tag: 'Trust & Safety', title: 'Dispute Resolution: 21% faster', sub: 'How escrow timing improved buyer confidence' },
];

export default function CaseStudies() {
  return (
    <section className="section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Case Studies</div>
            <h2 className="serif" style={{ fontSize: 'clamp(28px,3.2vw,42px)', color: 'var(--text)', letterSpacing: '-0.01em' }}>
              Real outcomes from real sellers
            </h2>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 100, padding: '10px 16px', minWidth: 220,
          }}>
            <Search size={15} color="var(--text3)" />
            <span style={{ fontSize: 13, color: 'var(--text3)' }}>Search case studies</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24 }}>
          {/* Featured large card */}
          <div style={{
            background: 'linear-gradient(160deg, #1A1430 0%, #0F0F1A 100%)',
            border: '1px solid var(--border2)', borderRadius: 24,
            padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            minHeight: 360, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -80, right: -80, width: 240, height: 240,
              background: 'radial-gradient(circle, rgba(139,124,246,0.25), transparent 70%)',
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
              <span style={{
                fontSize: 11, fontWeight: 600, color: 'var(--violet3)',
                background: 'var(--surface2)', padding: '5px 12px', borderRadius: 100,
                letterSpacing: '0.04em',
              }}>SALE OPTIMIZATION</span>
              <ArrowUpRight size={20} color="#fff" />
            </div>
            <div style={{ position: 'relative' }}>
              <svg width="100%" height="80" viewBox="0 0 400 80" style={{ marginBottom: 24 }}>
                <polyline points="0,60 40,50 80,55 120,30 160,40 200,15 240,28 280,10 320,22 360,5 400,18"
                  fill="none" stroke="#8B7CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 className="serif" style={{ fontSize: 26, color: '#fff', marginBottom: 8 }}>
                Optimized Sale Value: 98%
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text3)' }}>
                How a leading broadcaster turned dormant inventory into $200K+ in recovered value within 90 days.
              </p>
            </div>
          </div>

          {/* Small stacked cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {CASES.map((c, i) => (
              <div key={i} style={{
                background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 18,
                padding: 22, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                transition: 'border-color .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--violet)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--violet3)', letterSpacing: '0.05em', marginBottom: 8, textTransform: 'uppercase' }}>{c.tag}</span>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{c.title}</h4>
                <p style={{ fontSize: 12.5, color: 'var(--text3)' }}>{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
