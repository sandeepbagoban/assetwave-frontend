const BRANDS = [
  'SONY', 'itelco', 'cisco', 'ERICSSON', 'NOKIA', 'harmonic',
  'evertz', 'COMMSCOPE', 'Grass Valley', 'net insight',
  'SONY', 'itelco', 'cisco', 'ERICSSON', 'NOKIA', 'harmonic',
  'evertz', 'COMMSCOPE', 'Grass Valley', 'net insight',
];

export default function LogoBar() {
  return (
    <div style={{
      background: 'var(--bg2)',
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '24px 0',
      overflow: 'hidden',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <span style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 500, letterSpacing: '0.06em' }}>
          25,000+ Equipment Models From Leading Telecom & Media Brands
        </span>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>

      <div style={{ display: 'flex', overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}>
        <div style={{
          display: 'flex', gap: 56, alignItems: 'center',
          animation: 'marquee 28s linear infinite',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {BRANDS.map((b, i) => (
            <span key={i} style={{
              fontSize: b === b.toUpperCase() ? 15 : 16,
              fontWeight: b === b.toUpperCase() ? 700 : 600,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: b === b.toUpperCase() ? '0.08em' : '0',
              fontFamily: b === b.toUpperCase() ? 'var(--font-display)' : 'var(--font-body)',
              transition: 'color .2s',
              cursor: 'default',
              flexShrink: 0,
            }}
            onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.75)'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
