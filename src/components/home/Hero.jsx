import { Star, TrendingUp, ArrowRight, Sparkles, Leaf, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import SignalSculpture from '../visuals/SignalSculpture';

const FLOATING_BADGES = [
  { icon: TrendingUp, label: 'Escrow Tracking', top: '8%', right: '-4%', delay: '0s' },
  { icon: Leaf, label: 'Verified Sellers', top: '38%', right: '-10%', delay: '.3s' },
  { icon: Zap, label: 'Fast Payouts', top: '62%', right: '-2%', delay: '.6s' },
];

export default function Hero() {
  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,124,246,0.18), transparent), var(--bg)',
      overflow: 'hidden', paddingTop: 76,
    }}>
      {/* Subtle grid texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.4,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        opacity: 0.5,
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 60% 50% at 50% 30%, black, transparent)',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: 56, paddingBottom: 40 }}>
        {/* Top nav row content (eyebrow pill) */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--surface2)', border: '1px solid var(--border2)',
            borderRadius: 100, padding: '7px 16px 7px 10px',
          }}>
            <Sparkles size={13} color="var(--violet3)" />
            <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 450 }}>AssetWave Intelligence</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ textAlign: 'center', maxWidth: 880, margin: '0 auto 28px' }}>
          <h1 className="serif" style={{
            fontSize: 'clamp(40px, 5.4vw, 76px)', lineHeight: 1.05,
            color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 0,
          }}>
            Turning Dormant Assets<br />
            into <span className="serif-italic gradient-text">Working Capital</span>
          </h1>
        </div>

        <p style={{
          textAlign: 'center', fontSize: 17, color: 'var(--text2)',
          maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7, fontWeight: 350,
        }}>
          Engineering broadcasters and media companies to make smarter equipment decisions through real-time market data.
        </p>

        {/* Visual centerpiece with stat card + floating badges */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <SignalSculpture />

          {/* Optimized score card - top right of sculpture */}
          <div style={{
            position: 'absolute', top: '4%', right: 'calc(50% - 280px)',
            background: 'var(--inverse-bg)', borderRadius: 16,
            padding: '16px 18px', width: 168, boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
            animation: 'float 6s ease-in-out infinite', animationDelay: '.2s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: '#5B5B66', lineHeight: 1.4, fontWeight: 500 }}>Avg. Value<br/>Recovery</span>
              <ArrowRight size={14} color="var(--inverse-text)" style={{ transform: 'rotate(-45deg)' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--inverse-text)', marginBottom: 6 }}>35%</div>
            <svg width="100%" height="28" viewBox="0 0 130 28">
              <polyline points="0,22 20,18 38,20 55,10 72,14 90,4 110,8 130,2" fill="none" stroke="#8B7CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Floating glass badges - left side */}
          <div style={{
            position: 'absolute', bottom: '18%', left: 'calc(50% - 300px)',
            display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start',
          }}>
            <Link to="/register" state={{ intent: 'seller' }} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
              borderRadius: 100, padding: '11px 18px 11px 14px',
              fontSize: 13, fontWeight: 600,
              boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
              animation: 'float 5s ease-in-out infinite',
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: '50%', background: 'var(--violet)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><ArrowRight size={12} color="var(--inverse-text)" /></span>
              Start Selling
            </Link>
            <div className="glass-pill" style={{ animationDelay: '.3s' }}>
              <TrendingUp size={13} color="var(--violet3)" /> Carbon Tracking
            </div>
          </div>

          {/* Floating glass badges - right side */}
          <div style={{
            position: 'absolute', bottom: '8%', right: 'calc(50% - 300px)',
            display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end',
          }}>
            <div className="glass-pill" style={{ animationDelay: '.5s' }}>
              <Zap size={13} color="var(--ice)" /> Energy Savings
            </div>
            <div className="glass-pill" style={{ animationDelay: '.7s', opacity: 0.7 }}>
              Waste Reduction Insights
            </div>
          </div>
        </div>

        {/* Bottom row: rating + CTAs */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 28, flexWrap: 'wrap', marginTop: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="serif" style={{ fontSize: 28, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 4 }}>
              4.9 <Star size={14} fill="#FBBF24" color="#FBBF24" style={{ marginTop: -10 }} />
            </span>
            <span style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.4 }}>Trusted by<br/>top broadcasters</span>
          </div>

          <Link to="/marketplace" style={{
            background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
            padding: '14px 26px', borderRadius: 100, fontSize: 14, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all .2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
            Browse Marketplace <ArrowRight size={15} />
          </Link>
          <Link to="/register" state={{ intent: 'seller' }} style={{
            background: 'transparent', color: 'var(--text)', border: '1px solid var(--border2)',
            padding: '14px 26px', borderRadius: 100, fontSize: 14, fontWeight: 500,
            transition: 'all .2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--violet3)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}>
            List Your Equipment
          </Link>
        </div>
      </div>

      <style>{`
        .glass-pill {
          display: flex; align-items: center; gap: 7px;
          background: var(--glass);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border2);
          border-radius: 100px; padding: 9px 16px;
          font-size: 12px; color: var(--text2); font-weight: 500;
          white-space: nowrap;
          animation: float 5.5s ease-in-out infinite;
        }
        @media (max-width: 1100px) {
          .glass-pill, [style*="position: absolute"][style*="calc(50%"] { display: none !important; }
        }
      `}</style>
    </section>
  );
}
