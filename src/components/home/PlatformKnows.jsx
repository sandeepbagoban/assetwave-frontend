import { Package, MapPin, CircleDollarSign, Users, Store, CalendarClock } from 'lucide-react';

const PILLARS = [
  { icon: Package, title: 'What equipment exists', desc: 'Complete visibility across your organization' },
  { icon: MapPin, title: 'Where it is', desc: 'Real-time location and ownership tracking' },
  { icon: CircleDollarSign, title: "What it's worth", desc: 'Market-driven valuations and insights' },
  { icon: Users, title: 'Who wants it', desc: 'Access to global buyer demand' },
  { icon: Store, title: 'Who is selling it', desc: 'Connect with trusted, verified sellers' },
  { icon: CalendarClock, title: 'When to retire it', desc: 'Lifecycle and retirement intelligence' },
];

export default function PlatformKnows() {
  return (
    <section style={{ background: 'var(--bg2)', padding: '100px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="eyebrow" style={{ justifyContent: 'center', display: 'flex', marginBottom: 16 }}>The Intelligence Layer</div>
          <h2 className="serif" style={{ fontSize: 'clamp(30px,3.4vw,46px)', color: 'var(--text)', letterSpacing: '-0.01em' }}>
            The Platform Knows
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 1, background: 'var(--border)', borderRadius: 20, overflow: 'hidden' }}>
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} style={{
                textAlign: 'center', padding: '36px 18px', background: 'var(--bg2)',
                transition: 'background .25s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg2)'}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, margin: '0 auto 18px',
                  background: 'var(--surface2)', border: '1px solid var(--border2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={20} color="var(--violet3)" strokeWidth={1.6} />
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 8, lineHeight: 1.35 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.55 }}>{p.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
