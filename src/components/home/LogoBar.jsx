const BRANDS = [
  'Sony', 'Ericsson', 'Nokia', 'Harmonic', 'Evertz', 'Grass Valley',
  'Harris', 'SSL', 'Avid', 'Blackmagic',
];

export default function LogoBar() {
  const loop = [...BRANDS, ...BRANDS];
  return (
    <div style={{ background: 'var(--bg)', padding: '36px 0 56px', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          25,000+ equipment models from leading broadcast brands
        </span>
      </div>
      <div style={{ display: 'flex', overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)' }}>
        <div style={{ display: 'flex', gap: 64, alignItems: 'center', animation: 'marquee 32s linear infinite', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {loop.map((b, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text4)',
              transition: 'color .2s', cursor: 'default', flexShrink: 0,
            }}
            onMouseEnter={e => e.target.style.color = 'var(--text2)'}
            onMouseLeave={e => e.target.style.color = 'var(--text4)'}>
              {b}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
