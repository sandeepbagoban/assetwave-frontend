const FEATURES = [
  {
    num: '01',
    icon: '🛒',
    title: 'Asset Marketplace',
    desc: 'Buy and sell quality used broadcast & media equipment globally with escrow-protected payments and verified counterparties.',
    color: '#7B5EF8',
  },
  {
    num: '02',
    icon: '🔍',
    title: 'Surplus Identification Engine',
    desc: 'AI-powered engine identifies dormant, duplicate, and underutilized assets across your entire broadcast infrastructure.',
    color: '#22D3EE',
  },
  {
    num: '03',
    icon: '💲',
    title: 'Equipment Valuation',
    desc: 'Real-time market valuations backed by transaction data and pricing intelligence from 25,000+ equipment models.',
    color: '#34D399',
  },
  {
    num: '04',
    icon: '🪪',
    title: 'Equipment Passport',
    desc: 'Digital identity for every asset with full history, technical specs, service records, and compliance documentation.',
    color: '#FBBF24',
  },
  {
    num: '05',
    icon: '🔄',
    title: 'Resale Workflow',
    desc: 'Streamlined workflow from listing approval to sale confirmation, escrow payment, and international logistics coordination.',
    color: '#F87171',
  },
  {
    num: '06',
    icon: '📈',
    title: 'Lifecycle Intelligence',
    desc: 'Predict end-of-life, optimize replacement timing, redeploy or retire assets with confidence using market data.',
    color: '#A78BFA',
  },
];

export default function Features() {
  return (
    <section style={{ background: '#F8F9FC', padding: '96px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800,
            color: '#0C1229', letterSpacing: '-0.5px',
          }}>
            One Platform. End-to-End Asset Monetization.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              background: '#fff',
              border: '1px solid #E8ECF2',
              borderRadius: 14, padding: '28px 24px',
              transition: 'all .25s',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)';
              e.currentTarget.style.borderColor = f.color + '40';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#E8ECF2';
            }}>
              {/* Number badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, borderRadius: 8,
                background: f.color + '15',
                border: '1px solid ' + f.color + '30',
                fontSize: 11, fontWeight: 800, color: f.color,
                letterSpacing: '0.05em', marginBottom: 14,
              }}>{f.num}</div>

              {/* Icon */}
              <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>

              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
                color: '#0C1229', marginBottom: 10, lineHeight: 1.2,
              }}>{f.title}</h3>

              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 20 }}>{f.desc}</p>

              <a href="#" style={{
                fontSize: 13, fontWeight: 600, color: f.color,
                display: 'flex', alignItems: 'center', gap: 4,
                transition: 'gap .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.gap = '8px'}
              onMouseLeave={e => e.currentTarget.style.gap = '4px'}>
                Learn more →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
