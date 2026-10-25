import { Target, Globe2, ShieldCheck, Recycle } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import CtaBanner from '../components/home/CtaBanner';

const VALUES = [
  { icon: Target, title: 'Precision over volume', desc: 'During the pilot, our team reviews seller applications and works directly with participants.' },
  { icon: Globe2, title: 'Access, not charity', desc: 'Telecom and broadcast operators in emerging markets deserve fair pricing on real equipment, not donations or discount theater.' },
  { icon: ShieldCheck, title: 'Protect both sides', desc: 'Every deal is managed by the AWXchange team, with terms agreed before participants proceed.' },
  { icon: Recycle, title: 'Equipment has a second life', desc: 'A transmitter retired in one market can run for another decade somewhere else. That’s not waste — that’s a missed connection.' },
];


export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About AWXchange"
        title="Equipment doesn't retire."
        titleItalic="It relocates."
        desc="We started AWXchange because a transmitter sitting unused in a European warehouse and an operator in West Africa who can't afford a new one are the same problem, solved badly by distance and distrust."
      />

      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 className="serif" style={{ fontSize: 'clamp(26px,3vw,36px)', color: 'var(--text)', marginBottom: 24, letterSpacing: '-0.01em' }}>
            Our vision
          </h2>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.9, fontWeight: 350, marginBottom: 20 }}>
            AWXchange helps telecom and broadcast operators buy and sell surplus equipment &mdash; transforming dormant assets into working capital while reducing industry waste.
          </p>
          <p style={{ fontSize: 15.5, color: 'var(--text3)', lineHeight: 1.85 }}>
            Telecom and broadcast equipment is expensive, durable, and depreciates in book value far faster than it depreciates in usefulness. Most of it ends up in storage, not because it's worthless, but because the channels to resell it safely &mdash; across borders, across currencies, between strangers &mdash; haven't existed. We’re building a marketplace for telecom and broadcast equipment. During our pilot, the AWXchange team personally manages each deal and coordinates the next steps with buyers and sellers.
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


      <CtaBanner />
    </>
  );
}
