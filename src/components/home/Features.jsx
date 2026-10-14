import { ShoppingBag, CircleDollarSign, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { num: '01', icon: ShoppingBag, title: 'Asset Marketplace', desc: 'Buy and sell quality used telecom and broadcast equipment globally. Every deal is managed by the AWXchange team.' },
  { num: '02', icon: CircleDollarSign, title: 'Equipment Valuation', desc: 'Real-time market valuations backed by transaction data and pricing intelligence.' },
];

export default function Features() {
  return (
    <section className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="eyebrow" style={{ justifyContent: 'center', display: 'flex', marginBottom: 16 }}>How it works</div>
          <h2 className="serif" style={{ fontSize: 'clamp(30px,3.4vw,46px)', color: 'var(--text)', letterSpacing: '-0.01em' }}>
            One Platform. <span className="serif-italic gradient-text">Complete</span> Asset Monetization.
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: 'var(--border)',
          borderRadius: 24, overflow: 'hidden', maxWidth: 780, margin: '0 auto',
        }}>
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} style={{
                background: 'var(--bg2)', padding: '36px 32px', transition: 'background .25s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg2)'}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: 'var(--text4)' }}>{f.num}</span>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: 'var(--surface2)', border: '1px solid var(--border2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color="var(--violet3)" strokeWidth={1.6} />
                  </div>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text3)', lineHeight: 1.7, marginBottom: 20 }}>{f.desc}</p>
                <Link to="/features" style={{ fontSize: 13, fontWeight: 600, color: 'var(--violet3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  Learn more <ArrowUpRight size={13} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
