import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const JOURNEY = {
  2025: {
    headline: 'Scaling cross-border trust at volume',
    text: 'We expanded escrow-protected transactions across 40+ countries, formalized KYB verification for organization sellers, and crossed $2.4B in identified dormant asset value across our network.',
  },
  2024: {
    headline: 'Building the verification backbone',
    text: 'Launched two-sided KYC/KYB verification in partnership with leading identity providers, enabling the first fully escrow-protected transactions between broadcasters and individual buyers.',
  },
  2023: {
    headline: 'From concept to first transactions',
    text: 'AssetWave processed its first equipment sales between African and European broadcasters, proving the core thesis: dormant equipment has real, recoverable market value.',
  },
  2022: {
    headline: 'Mapping the opportunity',
    text: 'Began deep research into broadcast equipment depreciation, surplus inventory across major media organizations, and the trust barriers preventing cross-border resale.',
  },
};

const YEARS = Object.keys(JOURNEY).map(Number);

export default function ImpactTimeline() {
  const [active, setActive] = useState(2025);
  const idx = YEARS.indexOf(active);

  const go = dir => {
    const next = idx + dir;
    if (next >= 0 && next < YEARS.length) setActive(YEARS[next]);
  };

  return (
    <section className="section" style={{ background: 'var(--bg)' }}>
      <div className="container">
        <div className="eyebrow" style={{ marginBottom: 16 }}>Our Journey</div>
        <h2 className="serif" style={{ fontSize: 'clamp(28px,3.2vw,42px)', color: 'var(--text)', marginBottom: 8, letterSpacing: '-0.01em' }}>
          Our Journey in Impact
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text3)', maxWidth: 460, marginBottom: 56 }}>
          From a market hypothesis to a trusted cross-border marketplace — tracked year by year.
        </p>

        {/* Year selector row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 28, marginBottom: 44, flexWrap: 'wrap' }}>
          {YEARS.map(y => (
            <button key={y} onClick={() => setActive(y)} style={{
              background: 'none', border: 'none', padding: 0,
              fontFamily: 'var(--font-display)',
              fontSize: y === active ? 'clamp(48px,7vw,96px)' : 'clamp(32px,4.5vw,56px)',
              lineHeight: 1,
              transition: 'all .35s cubic-bezier(.2,.8,.2,1)',
              color: y === active ? 'transparent' : 'var(--text4)',
              background: y === active ? 'linear-gradient(135deg, #B4A9FB, #7DD3E8)' : 'none',
              WebkitBackgroundClip: y === active ? 'text' : 'unset',
              backgroundClip: y === active ? 'text' : 'unset',
              WebkitTextFillColor: y === active ? 'transparent' : 'var(--text4)',
            }}>
              {y}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'flex-end' }}>
          <div>
            <h3 className="serif" style={{ fontSize: 26, color: 'var(--text)', marginBottom: 14 }}>{JOURNEY[active].headline}</h3>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, maxWidth: 480 }}>{JOURNEY[active].text}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={() => go(-1)} disabled={idx === 0} style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'var(--surface2)', border: '1px solid var(--border2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text)', opacity: idx === 0 ? 0.3 : 1,
              cursor: idx === 0 ? 'default' : 'pointer',
            }}><ChevronLeft size={18} /></button>
            <button onClick={() => go(1)} disabled={idx === YEARS.length - 1} style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'var(--inverse-bg)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--inverse-text)', opacity: idx === YEARS.length - 1 ? 0.3 : 1,
              cursor: idx === YEARS.length - 1 ? 'default' : 'pointer',
            }}><ChevronRight size={18} /></button>
          </div>
        </div>

        {/* Gradient bar strip - decorative, echoes reference */}
        <div style={{ display: 'flex', gap: 4, marginTop: 64, height: 6, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ flex: 2, background: 'linear-gradient(90deg, #5B4FC4, #8B7CF6)' }} />
          <div style={{ flex: 1, background: 'var(--surface2)' }} />
          <div style={{ flex: 3, background: 'linear-gradient(90deg, #8B7CF6, #7DD3E8)' }} />
          <div style={{ flex: 1, background: 'var(--surface2)' }} />
          <div style={{ flex: 1.5, background: 'linear-gradient(90deg, #B4A9FB, #C9BFFA)' }} />
        </div>
      </div>
    </section>
  );
}
