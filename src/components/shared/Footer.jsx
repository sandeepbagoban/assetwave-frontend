import { Link } from 'react-router-dom';

// Only links with a real destination are listed — a shorter, honest footer
// beats columns of dead href="#" links.
const COLUMNS = [
  { title: 'Platform', links: [
    { label: 'Overview', to: '/' },
    { label: 'Features', to: '/features' },
    { label: 'Impact', to: '/impact' },
  ] },
  { title: 'Marketplace', links: [
    { label: 'Browse Equipment', to: '/marketplace' },
    { label: 'Sell Equipment', to: '/register', state: { intent: 'seller' } },
    { label: 'How It Works', to: '/features' },
  ] },
  { title: 'Company', links: [
    { label: 'About Us', to: '/about' },
    { label: 'Resources', to: '/resources' },
    { label: 'Contact', to: '/contact' },
  ] },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', paddingTop: 72 }}>
      <div className="container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(3, 1fr)', gap: 32, marginBottom: 56 }}>
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
              <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
                <path d="M13 2L23 8V18L13 24L3 18V8L13 2Z" stroke="url(#flogo)" strokeWidth="1.4" strokeLinejoin="round"/>
                <defs><linearGradient id="flogo" x1="3" y1="2" x2="23" y2="24"><stop stopColor="#B4A9FB"/><stop offset="1" stopColor="#7DD3E8"/></linearGradient></defs>
              </svg>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text)' }}>AssetWave</span>
            </Link>
            <p style={{ fontSize: 13.5, color: 'var(--text3)', lineHeight: 1.7, maxWidth: 260, marginBottom: 22 }}>
              Building the world's leading asset intelligence network for broadcast and media equipment lifecycle management and monetization.
            </p>
          </div>

          {COLUMNS.map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 18 }}>{col.title}</h4>
              {col.links.map(l => (
                <Link key={l.label} to={l.to} state={l.state} style={{ display: 'block', fontSize: 13.5, color: 'var(--text3)', marginBottom: 12, transition: 'color .15s' }}
                   onMouseEnter={e => e.currentTarget.style.color = 'var(--violet3)'}
                   onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '1px solid var(--border)', padding: '24px 0',
        }}>
          <span style={{ fontSize: 12.5, color: 'var(--text4)' }}>© 2026 AssetWave. All rights reserved.</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
