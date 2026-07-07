import { Link } from 'react-router-dom';

const SocialIcon = ({ path }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d={path} /></svg>
);
const ICONS = {
  linkedin: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.34 18.34V10H5.67v8.34zM7 8.7a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.64v-4.5c0-2.4-1.28-3.52-3-3.52a2.6 2.6 0 0 0-2.35 1.29h-.03V10H10.3c.03.7 0 8.34 0 8.34h2.67v-4.66c0-.25.02-.5.1-.68a1.5 1.5 0 0 1 1.36-1c.96 0 1.34.73 1.34 1.8v4.54z',
  twitter: 'M18.9 2H22l-7.2 8.2L23.3 22H16.7l-5.1-6.7L5.7 22H2.5l7.7-8.8L1.7 2h6.8l4.6 6.1zm-1.1 18h1.7L7.3 4H5.4z',
  facebook: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z',
};

const COLUMNS = [
  { title: 'Platform', links: ['Overview', 'Features', 'Integrations', 'Security'] },
  { title: 'Solutions', links: ['Broadcasters', 'Media Companies', 'Transmission Networks', 'Satellite Operators'] },
  { title: 'Marketplace', links: ['Browse Equipment', 'Sell Equipment', 'Find Buyers', 'How It Works'] },
  { title: 'Resources', links: ['Case Studies', 'Whitepapers', 'Blog', 'Support'] },
  { title: 'Company', links: ['About Us', 'Careers', 'Partners', 'Contact Us'] },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', paddingTop: 72 }}>
      <div className="container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(5, 1fr)', gap: 32, marginBottom: 56 }}>
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
            <div style={{ display: 'flex', gap: 10 }}>
              {['linkedin', 'twitter', 'facebook'].map((key) => (
                <div key={key} style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all .2s', color: 'var(--text)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--violet)'; e.currentTarget.style.borderColor = 'var(--violet)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)'; }}>
                  <SocialIcon path={ICONS[key]} />
                </div>
              ))}
            </div>
          </div>

          {COLUMNS.map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 18 }}>{col.title}</h4>
              {col.links.map(l => (
                <a key={l} href="#" style={{ display: 'block', fontSize: 13.5, color: 'var(--text3)', marginBottom: 12, transition: 'color .15s' }}
                   onMouseEnter={e => e.currentTarget.style.color = 'var(--violet3)'}
                   onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '1px solid var(--border)', padding: '24px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontSize: 12.5, color: 'var(--text4)' }}>© 2026 AssetWave. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 22 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a key={t} href="#" style={{ fontSize: 12.5, color: 'var(--text4)' }}>{t}</a>
            ))}
          </div>
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
