const PILLARS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="4" stroke="#7B5EF8" strokeWidth="1.5"/>
        <rect x="9" y="9" width="4" height="4" rx="1" fill="#7B5EF8"/>
        <rect x="15" y="9" width="4" height="4" rx="1" fill="#7B5EF8" opacity=".5"/>
        <rect x="9" y="15" width="4" height="4" rx="1" fill="#7B5EF8" opacity=".5"/>
        <rect x="15" y="15" width="4" height="4" rx="1" fill="#7B5EF8" opacity=".3"/>
      </svg>
    ),
    title: 'What equipment exists',
    desc: 'Complete visibility across your organization',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="13" cy="12" r="7" stroke="#7B5EF8" strokeWidth="1.5"/>
        <path d="M18 18L23 23" stroke="#7B5EF8" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="13" cy="12" r="3" fill="#7B5EF8" opacity=".4"/>
      </svg>
    ),
    title: 'Where it is',
    desc: 'Real-time location and ownership tracking',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="9" stroke="#7B5EF8" strokeWidth="1.5"/>
        <text x="14" y="18.5" textAnchor="middle" fill="#7B5EF8" fontSize="11" fontWeight="700">$</text>
      </svg>
    ),
    title: "What it's worth",
    desc: 'Market-driven valuations and insights',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="10" cy="11" r="4" stroke="#7B5EF8" strokeWidth="1.5"/>
        <circle cx="18" cy="11" r="4" stroke="#7B5EF8" strokeWidth="1.5" opacity=".5"/>
        <path d="M4 23c0-3.314 2.686-6 6-6h8c3.314 0 6 2.686 6 6" stroke="#7B5EF8" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Who wants it',
    desc: 'Access to global buyer demand',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="8" width="20" height="14" rx="3" stroke="#7B5EF8" strokeWidth="1.5"/>
        <path d="M9 6V5M14 6V5M19 6V5" stroke="#7B5EF8" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 14h12M8 18h7" stroke="#7B5EF8" strokeWidth="1.2" strokeLinecap="round" opacity=".5"/>
      </svg>
    ),
    title: 'Who is selling it',
    desc: 'Connect with trusted sellers',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="6" width="16" height="16" rx="3" stroke="#7B5EF8" strokeWidth="1.5"/>
        <path d="M10 6V4M14 6V4" stroke="#7B5EF8" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 13l3 3 5-5" stroke="#7B5EF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 12v10" stroke="#7B5EF8" strokeWidth="1.5" strokeLinecap="round" opacity=".5"/>
        <path d="M19 19l3 3 3-3" stroke="#7B5EF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".5"/>
      </svg>
    ),
    title: 'When it should be retired',
    desc: 'Lifecycle and retirement intelligence',
  },
];

export default function PlatformKnows() {
  return (
    <section style={{ background: '#fff', padding: '80px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 800,
            color: '#0C1229', letterSpacing: '-0.5px', marginBottom: 12,
          }}>The Platform Knows</h2>
          <div style={{ width: 48, height: 3, background: 'linear-gradient(90deg, #7B5EF8, #22D3EE)', borderRadius: 2, margin: '0 auto' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {PILLARS.map((p, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '28px 16px',
              borderRadius: 12, cursor: 'default',
              transition: 'all .25s',
              border: '1px solid transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#F8F7FF';
              e.currentTarget.style.borderColor = 'rgba(123,94,248,0.2)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'none';
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: 'rgba(123,94,248,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
              }}>
                {p.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0C1229', marginBottom: 6, lineHeight: 1.3 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
