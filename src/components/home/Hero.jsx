import { Star, TrendingUp, ArrowRight, Sparkles, DollarSign, Package, Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SignalSculpture from '../visuals/SignalSculpture';

const STATS = [
  { icon: DollarSign, value: '$2.4B+', label: 'Dormant asset value identified' },
  { icon: Package, value: '25,000+', label: 'Equipment models tracked' },
  { icon: Globe2, value: '40+', label: 'Countries with verified buyers & sellers' },
  { icon: TrendingUp, value: '35%', label: 'Average value recovery' },
];

export default function Hero() {
  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,124,246,0.14), transparent), var(--bg)',
      overflow: 'hidden', paddingTop: 76,
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.35,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
        maskImage: 'radial-gradient(ellipse 60% 50% at 50% 30%, black, transparent)',
      }} />

      <div className="container aw-split-hero" style={{
        position: 'relative', zIndex: 2, display: 'grid', gap: 56, alignItems: 'center',
        paddingTop: 40, paddingBottom: 40,
      }}>
        {/* Left: message + primary CTAs */}
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--surface2)', border: '1px solid var(--border2)',
            borderRadius: 100, padding: '7px 16px 7px 10px', marginBottom: 24,
          }}>
            <Sparkles size={13} color="var(--violet3)" />
            <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 450 }}>AssetWave Intelligence</span>
          </div>

          <h1 className="serif" style={{
            fontSize: 'clamp(38px, 4.6vw, 60px)', lineHeight: 1.08,
            color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 20,
          }}>
            Turning dormant assets<br />
            into <span className="serif-italic gradient-text">working capital</span>
          </h1>

          <p style={{
            fontSize: 16.5, color: 'var(--text2)', maxWidth: 460,
            marginBottom: 32, lineHeight: 1.65, fontWeight: 350,
          }}>
            Engineering broadcasters and media companies to make smarter equipment decisions through real-time market data — buy and sell with escrow protection built in.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
            <Link to="/register" state={{ intent: 'seller' }} className="aw-btn" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
              padding: '15px 28px', borderRadius: 100, fontSize: 15, fontWeight: 600,
            }}>
              Start Selling <ArrowRight size={16} />
            </Link>
            <Link to="/marketplace" className="aw-btn" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'transparent', color: 'var(--text)', border: '1px solid var(--border2)',
              padding: '15px 28px', borderRadius: 100, fontSize: 15, fontWeight: 500,
            }}>
              Start Buying
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="serif" style={{ fontSize: 22, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 4 }}>
              4.9 <Star size={13} fill="#FBBF24" color="#FBBF24" style={{ marginTop: -8 }} />
            </span>
            <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>Trusted by top broadcasters</span>
          </div>
        </div>

        {/* Right: signal sculpture accent + stat panel */}
        <div style={{ position: 'relative', minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.55, pointerEvents: 'none' }}>
            <SignalSculpture />
          </div>

          <div className="aw-surface" style={{ position: 'relative', zIndex: 1, borderRadius: 20, padding: 28, width: '100%', maxWidth: 340 }}>
            <div style={{ fontSize: 11.5, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 18, fontWeight: 600 }}>
              By the numbers
            </div>
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                paddingBottom: i < STATS.length - 1 ? 16 : 0,
                marginBottom: i < STATS.length - 1 ? 16 : 0,
                borderBottom: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: 'var(--surface2)', border: '1px solid var(--border2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon size={17} color="var(--violet3)" strokeWidth={1.6} />
                </div>
                <div>
                  <div className="serif" style={{ fontSize: 21, color: 'var(--text)', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text3)', marginTop: 3 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
