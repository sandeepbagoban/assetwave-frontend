import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Sun, Moon, ShoppingCart, LogOut, Store } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const NAV_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Features', to: '/features' },
  { label: 'Impact', to: '/impact' },
  // { label: 'Marketplace', to: '/marketplace' },
  { label: 'Resources', to: '/resources' },
  { label: 'Contact', to: '/contact' },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        position: 'relative',
        width: 40, height: 40, borderRadius: 10,
        background: 'var(--surface)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text2)', flexShrink: 0, transition: 'all .2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet3)'; e.currentTarget.style.color = 'var(--text)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
    >
      <span style={{
        position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity .25s, transform .25s',
        opacity: isDark ? 1 : 0, transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-60deg) scale(.6)',
      }}><Moon size={17} strokeWidth={1.7} /></span>
      <span style={{
        position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'opacity .25s, transform .25s',
        opacity: isDark ? 0 : 1, transform: isDark ? 'rotate(60deg) scale(.6)' : 'rotate(0deg) scale(1)',
      }}><Sun size={17} strokeWidth={1.7} /></span>
    </button>
  );
}

function CartLink() {
  const { itemCount } = useCart();
  return (
    <Link to="/cart" style={{
      position: 'relative', width: 40, height: 40, borderRadius: 10,
      background: 'var(--surface)', border: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', flexShrink: 0,
    }}>
      <ShoppingCart size={17} strokeWidth={1.7} />
      {itemCount > 0 && (
        <span style={{
          position: 'absolute', top: -5, right: -5, minWidth: 17, height: 17, borderRadius: 100,
          background: 'var(--violet)', color: '#fff', fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
        }}>{itemCount}</span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      transition: 'all .35s cubic-bezier(.2,.8,.2,1)',
      background: scrolled ? 'var(--glass)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 76, gap: 8 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginRight: 'auto' }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M13 2L23 8V18L13 24L3 18V8L13 2Z" stroke="url(#navlogo)" strokeWidth="1.4" strokeLinejoin="round"/>
            <path d="M13 2V24M3 8L23 18M23 8L3 18" stroke="url(#navlogo)" strokeWidth="0.6" opacity="0.5"/>
            <defs>
              <linearGradient id="navlogo" x1="3" y1="2" x2="23" y2="24">
                <stop stopColor="#B4A9FB"/><stop offset="1" stopColor="#7DD3E8"/>
              </linearGradient>
            </defs>
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            AssetWave
          </span>
        </Link>

        {/* Desktop links */}
        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {NAV_LINKS.map(link => (
            <NavLink key={link.to} to={link.to} style={({ isActive }) => ({
              padding: '8px 16px', fontSize: 14, fontWeight: 450,
              color: isActive ? 'var(--text)' : 'var(--text2)',
              borderRadius: 100,
              background: isActive ? 'var(--surface2)' : 'transparent',
              transition: 'all .2s',
            })}>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        {/* <div className="nav-desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 24 }}>
          <ThemeToggle />
          {user && <CartLink />}
          {user ? (
            <>
              <Link to="/account/orders" style={{
                background: 'transparent', border: 'none', color: 'var(--text2)', padding: '8px 14px',
                fontSize: 14, fontWeight: 450,
              }}>Orders</Link>
              <Link to="/account/seller" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent', border: 'none', color: 'var(--text2)', padding: '8px 14px', fontSize: 14, fontWeight: 450,
              }}><Store size={14} /> Sell</Link>
              <span style={{
                fontSize: 13, color: 'var(--text2)', maxWidth: 140, overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 4px',
              }}>{user.full_name || user.email}</span>
              <button onClick={handleLogout} title="Log out" style={{
                width: 40, height: 40, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', flexShrink: 0,
              }}><LogOut size={16} strokeWidth={1.7} /></button>
            </>
          ) : (
            <>
              <Link to="/login" state={{ from: location.pathname }} style={{
                background: 'transparent', border: 'none',
                color: 'var(--text2)', padding: '8px 14px',
                fontSize: 14, fontWeight: 450, transition: 'color .2s',
              }}>
                Log in
              </Link>
              <Link to="/register" style={{
                background: 'var(--inverse-bg)', color: 'var(--inverse-text)',
                border: 'none', padding: '10px 20px',
                borderRadius: 100, fontSize: 14, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all .2s',
              }}>
                Get Started <ArrowUpRight size={14} strokeWidth={2.2} />
              </Link>
            </>
          )}
        </div> */}

        {/* Mobile toggle */}
        <div className="nav-mobile-actions" style={{ display: 'none', alignItems: 'center', gap: 8 }}>
          <ThemeToggle />
          {user && <CartLink />}
          <button className="nav-mobile-toggle" onClick={() => setMobileOpen(v => !v)} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)',
          }}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {/* {mobileOpen && (
        <div style={{
          background: 'var(--bg2)', borderTop: '1px solid var(--border)',
          padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {NAV_LINKS.map(link => (
            <NavLink key={link.to} to={link.to} onClick={() => setMobileOpen(false)} style={{
              padding: '12px 8px', fontSize: 15, color: 'var(--text2)', borderBottom: '1px solid var(--border)',
            }}>
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <div style={{ padding: '12px 8px', fontSize: 13, color: 'var(--text3)' }}>Signed in as {user.full_name || user.email}</div>
              <Link to="/account/orders" onClick={() => setMobileOpen(false)} style={{ padding: '12px 8px', fontSize: 15, color: 'var(--text2)', borderBottom: '1px solid var(--border)' }}>Orders</Link>
              <Link to="/account/seller" onClick={() => setMobileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 8px', fontSize: 15, color: 'var(--text2)', borderBottom: '1px solid var(--border)' }}><Store size={14} /> Sell on AssetWave</Link>
              <button onClick={() => { setMobileOpen(false); handleLogout(); }} style={{
                marginTop: 16, background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)',
                padding: '12px', borderRadius: 100, fontSize: 14, fontWeight: 600,
              }}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" state={{ from: location.pathname }} onClick={() => setMobileOpen(false)} style={{ padding: '12px 8px', fontSize: 15, color: 'var(--text2)', borderBottom: '1px solid var(--border)' }}>Log in</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} style={{
                marginTop: 16, background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
                padding: '12px', borderRadius: 100, fontSize: 14, fontWeight: 600, textAlign: 'center',
              }}>Get Started</Link>
            </>
          )}
        </div>
      )} */}

      <style>{`
        @media (max-width: 980px) {
          .nav-desktop-links, .nav-desktop-actions { display: none !important; }
          .nav-mobile-actions { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
