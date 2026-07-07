const COLUMNS = [
  {
    title: 'Platform',
    links: ['Overview', 'Features', 'Integrations', 'Security'],
  },
  {
    title: 'Solutions',
    links: ['Broadcasters', 'Media Companies', 'Transmission Networks', 'Satellite Operators'],
  },
  {
    title: 'Marketplace',
    links: ['Browse Equipment', 'Sell Equipment', 'Find Buyers', 'How It Works'],
  },
  {
    title: 'Resources',
    links: ['Case Studies', 'Whitepapers', 'Blog', 'Support'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Partners', 'Contact Us'],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', paddingTop: 64 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(5, 1fr)', gap: 32, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: 'linear-gradient(135deg, #7B5EF8, #22D3EE)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: '#fff',
              }}>AW</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, color: '#fff' }}>AssetWave</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Broadcast & Media</div>
              </div>
            </a>
            <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>
              Building the world's leading asset intelligence network for broadcast and media equipment lifecycle management and monetization.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {['in', '𝕏', 'f'].map(s => (
                <div key={s} style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, color: 'var(--text2)', cursor: 'pointer',
                  transition: 'all .2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--purple)'; e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Columns */}
          {COLUMNS.map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16, letterSpacing: '0.02em' }}>{col.title}</h4>
              {col.links.map(l => (
                <a key={l} href="#" style={{
                  display: 'block', fontSize: 13, color: 'var(--text3)',
                  marginBottom: 11, transition: 'color .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--purple3)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text3)'}>
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '22px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontSize: 12, color: 'var(--text4)' }}>© 2026 AssetWave. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
              <a key={t} href="#" style={{ fontSize: 12, color: 'var(--text4)' }}
                 onMouseEnter={e => e.currentTarget.style.color = 'var(--text3)'}
                 onMouseLeave={e => e.currentTarget.style.color = 'var(--text4)'}>
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
