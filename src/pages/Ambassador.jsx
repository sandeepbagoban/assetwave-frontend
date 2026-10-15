import { Megaphone, Handshake, Wallet } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import CtaBanner from '../components/home/CtaBanner';

const PERKS = [
  { icon: Wallet, title: 'Earn on every referral', desc: 'Get a share of the transaction fee for every buyer or seller you bring onto AssetWave, for as long as they stay active.' },
  { icon: Handshake, title: 'Priority support', desc: 'A direct line to our team for your referrals — faster verification, faster answers, no waiting in the general queue.' },
  { icon: Megaphone, title: 'Early access', desc: 'First look at new categories, regions, and features before they roll out publicly.' },
];

export default function Ambassador() {
  return (
    <>
      <PageHeader
        eyebrow="Ambassador program"
        title="Bring your network,"
        titleItalic="get paid for it"
        desc="If you already know broadcasters and media companies buying or selling equipment, become an AssetWave ambassador and earn for every introduction that turns into a trade."
      />

      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.8, fontWeight: 350 }}>
            The ambassador program is built for people already embedded in broadcast and media procurement — engineers, consultants, resellers, and former operators — who hear about equipment moving before we do. You make the introduction; we handle verification, escrow, and logistics.
          </p>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Why join</div>
          <h2 className="serif" style={{ fontSize: 'clamp(26px,3vw,36px)', color: 'var(--text)', marginBottom: 48, letterSpacing: '-0.01em' }}>
            What ambassadors get
          </h2>
          <div className="aw-grid-3" style={{ display: 'grid', gap: 24 }}>
            {PERKS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="aw-surface" style={{ borderRadius: 18, padding: 28 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, marginBottom: 18,
                    background: 'var(--surface2)', border: '1px solid var(--border2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon size={19} color="var(--violet3)" strokeWidth={1.6} /></div>
                  <h3 style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--text3)', lineHeight: 1.7 }}>{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container" style={{ maxWidth: 640, textAlign: 'center' }}>
          <h2 className="serif" style={{ fontSize: 'clamp(24px,2.8vw,32px)', color: 'var(--text)', marginBottom: 14, letterSpacing: '-0.01em' }}>
            Ready to apply?
          </h2>
          <p style={{ fontSize: 14.5, color: 'var(--text3)', lineHeight: 1.7, marginBottom: 28 }}>
            Send us a short note about your network and how you'd introduce us — we review every application personally.
          </p>
          <a href="mailto:ambassadors@awxchange.com" className="aw-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none',
            padding: '14px 28px', borderRadius: 100, fontSize: 14.5, fontWeight: 600,
          }}>
            Apply to become an ambassador
          </a>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
