import { Target, Globe2, ShieldCheck, Recycle } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import CtaBanner from '../components/home/CtaBanner';

const VALUES = [
  { icon: Target, title: 'Precision over volume', desc: 'We verify every seller and every buyer rather than chase listing counts. Trust compounds; shortcuts don’t.' },
  { icon: Globe2, title: 'Access, not charity', desc: 'Broadcasters in emerging markets deserve fair pricing on real equipment, not donations or discount theater.' },
  { icon: ShieldCheck, title: 'Protect both sides', desc: 'Escrow exists because trust shouldn’t depend on hope. The mechanism does the work, not goodwill.' },
  { icon: Recycle, title: 'Equipment has a second life', desc: 'A transmitter retired in one market can run for another decade somewhere else. That’s not waste — that’s a missed connection.' },
];

const TEAM = [
  { name: 'Founding team', role: 'Product & Engineering', note: 'Building the marketplace, escrow ledger, and verification flows.' },
  { name: 'Advisory network', role: 'Broadcast Industry', note: 'Former engineers and procurement leads from major broadcasters.' },
  { name: 'Operations', role: 'Trust & Safety', note: 'Verification review, dispute mediation, seller onboarding.' },
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About AssetWave"
        title="Equipment doesn't retire."
        titleItalic="It relocates."
        desc="We started AssetWave because a transmitter sitting unused in a European warehouse and a broadcaster in West Africa who can't afford a new one are the same problem, solved badly by distance and distrust."
      />

      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 className="serif" style={{ fontSize: 'clamp(26px,3vw,36px)', color: 'var(--text)', marginBottom: 24, letterSpacing: '-0.01em' }}>
            Our vision
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.9, fontWeight: 350, marginBottom: 20 }}>
            AssetWave helps broadcasters identify, value, manage, exchange, and sell equipment throughout its lifecycle &mdash; transforming dormant assets into working capital while reducing industry waste.
          </p>
          <p style={{ fontSize: 15.5, color: 'var(--text3)', lineHeight: 1.85 }}>
            Broadcast equipment is expensive, durable, and depreciates in book value far faster than it depreciates in usefulness. Most of it ends up in storage, not because it's worthless, but because the channels to resell it safely &mdash; across borders, across currencies, between strangers &mdash; haven't existed. We built the verification, escrow, and logistics coordination to make that exchange trustworthy on both sides.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>What we believe</div>
          <h2 className="serif" style={{ fontSize: 'clamp(28px,3.2vw,40px)', color: 'var(--text)', marginBottom: 56, letterSpacing: '-0.01em' }}>
            Principles, not slogans
          </h2>
          <div className="aw-grid-2" style={{ display: 'grid', gap: 24 }}>
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} style={{ display: 'flex', gap: 20, padding: '28px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                    background: 'var(--surface2)', border: '1px solid var(--border2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} color="var(--violet3)" strokeWidth={1.6} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{v.title}</h3>
                    <p style={{ fontSize: 14, color: 'var(--text3)', lineHeight: 1.7 }}>{v.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Who's building this</div>
          <h2 className="serif" style={{ fontSize: 'clamp(28px,3.2vw,40px)', color: 'var(--text)', marginBottom: 56, letterSpacing: '-0.01em' }}>
            A small team, deliberately
          </h2>
          <div className="aw-grid-3" style={{ display: 'grid', gap: 24 }}>
            {TEAM.map((t, i) => (
              <div key={i} className="aw-surface" style={{ borderRadius: 18, padding: 28 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, marginBottom: 18,
                  background: 'linear-gradient(135deg, #8B7CF6, #7DD3E8)', opacity: 0.85,
                }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{t.name}</h3>
                <div style={{ fontSize: 12.5, color: 'var(--violet3)', fontWeight: 500, marginBottom: 12 }}>{t.role}</div>
                <p style={{ fontSize: 13.5, color: 'var(--text3)', lineHeight: 1.6 }}>{t.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
