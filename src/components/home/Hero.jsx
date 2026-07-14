import { useState, useEffect } from 'react';
import { Star, TrendingUp, ArrowRight, Sparkles, DollarSign, Package, Globe2, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import SignalSculpture from '../visuals/SignalSculpture';

const SLIDES = [
  { icon: DollarSign, value: '$2.4B+', label: 'Dormant asset value identified' },
  { icon: Package, value: '25,000+', label: 'Equipment models tracked' },
  { icon: ShieldCheck, value: '100%', label: 'Escrow-protected transactions' },
  { icon: Globe2, value: '40+', label: 'Countries with verified buyers & sellers' },
  { icon: TrendingUp, value: '35%', label: 'Average value recovery' },
];

const SLIDE_INTERVAL_MS = 4200;

function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex(i => (i + 1) % SLIDES.length), SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused]);

  const slide = SLIDES[index];
  const Icon = slide.icon;

  return (
    <div
      className="aw-surface"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative', zIndex: 1, borderRadius: 24, padding: '40px 36px',
        width: '100%', maxWidth: 360, minHeight: 240,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,124,246,0.25) 0%, transparent 70%)',
      }} />

      <div key={index} className="aw-fade-up" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: 60, height: 60, borderRadius: 16, margin: '0 auto 20px',
          background: 'var(--surface2)', border: '1px solid var(--border2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={26} color="var(--violet3)" strokeWidth={1.5} />
        </div>
        <div className="serif" style={{ fontSize: 40, color: 'var(--text)', marginBottom: 8, lineHeight: 1 }}>{slide.value}</div>
        <div style={{ fontSize: 13.5, color: 'var(--text3)', lineHeight: 1.5, maxWidth: 220, margin: '0 auto' }}>{slide.label}</div>
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 28, position: 'relative', zIndex: 1 }}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            style={{
              width: i === index ? 22 : 6, height: 6, borderRadius: 3, border: 'none', padding: 0,
              background: i === index ? 'var(--violet3)' : 'var(--border2)',
              transition: 'all .35s var(--ease)', cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(139,124,246,0.18), transparent), var(--bg)',
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
            fontSize: 'clamp(38px, 4.6vw, 62px)', lineHeight: 1.06,
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
              boxShadow: '0 12px 32px rgba(0,0,0,0.16)',
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

        {/* Right: signal sculpture ambiance + rotating stat slider */}
        <div style={{ position: 'relative', minHeight: 440, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.6, pointerEvents: 'none' }}>
            <SignalSculpture />
          </div>

          {/* Floating glass badges for depth/motion, kept light so the slider stays the focal point */}
          <div className="glass-pill" style={{ position: 'absolute', top: '6%', left: '2%', animationDelay: '.2s' }}>
            <Zap size={13} color="var(--ice)" /> Fast payouts
          </div>
          <div className="glass-pill" style={{ position: 'absolute', bottom: '10%', right: '0%', animationDelay: '.6s' }}>
            <ShieldCheck size={13} color="var(--violet3)" /> Verified sellers
          </div>

          <HeroSlider />
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
        @media (max-width: 900px) {
          .glass-pill { display: none !important; }
        }
      `}</style>
    </section>
  );
}
