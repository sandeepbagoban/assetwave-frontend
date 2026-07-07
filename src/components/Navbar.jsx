import { useState, useEffect } from 'react';

const NAV_LINKS = ['Platform', 'Solutions', 'Marketplace', 'Resources', 'Company', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      transition: 'all .3s',
      background: scrolled ? 'rgba(6,9,26,0.95)' : 'rgba(6,9,26,0.6)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 68, gap: 40 }}>
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #7B5EF8, #22D3EE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
            color: '#fff', letterSpacing: '-0.5px',
          }}>AW</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: '#fff', lineHeight: 1.1 }}>
              AssetWave
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Broadcast & Media
            </div>
          </div>
        </a>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
          {NAV_LINKS.map(link => (
            <a key={link} href="#" style={{
              padding: '6px 14px', fontSize: 14, fontWeight: 500,
              color: 'var(--text2)', borderRadius: 8,
              transition: 'all .2s',
            }}
            onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.background = 'var(--surface)'; }}
            onMouseLeave={e => { e.target.style.color = 'var(--text2)'; e.target.style.background = 'transparent'; }}>
              {link}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button style={{
            background: 'transparent', border: '1px solid var(--border2)',
            color: 'var(--text2)', padding: '8px 18px',
            borderRadius: 8, fontSize: 14, fontWeight: 500,
            transition: 'all .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--purple3)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}>
            Login
          </button>
          <button style={{
            background: 'linear-gradient(135deg, #7B5EF8, #6347E0)',
            border: 'none', color: '#fff', padding: '9px 20px',
            borderRadius: 8, fontSize: 14, fontWeight: 600,
            boxShadow: '0 4px 16px rgba(123,94,248,0.4)',
            transition: 'all .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(123,94,248,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(123,94,248,0.4)'; }}>
            Request a Demo
          </button>
        </div>
      </div>
    </nav>
  );
}
