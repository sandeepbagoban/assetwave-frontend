import { ShieldCheck, Lock, FileSearch, Truck, ScrollText, ArrowRight } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import Features from '../components/home/Features';
import CtaBanner from '../components/home/CtaBanner';

const DEEP_DIVES = [
  {
    icon: ShieldCheck,
    tag: 'Identity & Trust',
    title: 'Two-sided verification, built in',
    desc: 'Every organization seller completes KYB — business registration, beneficial ownership, banking details. Every buyer completes KYC — government ID and a liveness check. Neither side transacts until verified.',
    points: ['Business registration & tax ID verification', 'Beneficial ownership disclosure for organizations', 'Government ID + liveness check for individuals', 'Verification status visible on every listing'],
  },
  {
    icon: Lock,
    tag: 'Payments',
    title: 'Escrow on every transaction',
    desc: 'Buyer funds are captured and held the moment checkout completes. The seller is not paid until the buyer confirms the item matches what was listed — or the inspection window closes without a dispute.',
    points: ['Funds held until delivery is confirmed', 'A 5-day inspection window after delivery', 'Automatic release if no dispute is raised', 'Commission deducted automatically on release'],
  },
  {
    icon: FileSearch,
    tag: 'Disputes',
    title: 'A fair process when something goes wrong',
    desc: 'If equipment arrives damaged or doesn’t match its listing, either party can open a dispute with photo or video evidence. Our team reviews and applies a resolution — full refund, partial refund, or release to seller.',
    points: ['Evidence-based mediation, not automated rules', 'Resolution applied within the inspection window', 'Full audit trail of every transaction event'],
  },
  {
    icon: Truck,
    tag: 'Logistics',
    title: 'Seller-managed shipping, platform-tracked',
    desc: 'Sellers handle their own freight relationships — they know their equipment’s packaging and customs requirements best. AssetWave tracks shipment status and proof of delivery against every order.',
    points: ['Sellers choose their own freight partners', 'Tracking number and carrier logged per order', 'Proof of delivery stored against the order record'],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Platform Features"
        title="Every step of the trade,"
        titleItalic="protected"
        desc="From verification to payout, AssetWave is built around one question: what would make a stranger on another continent trust this transaction?"
      />

      <Features />

      <section className="section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border)', borderRadius: 24, overflow: 'hidden' }}>
            {DEEP_DIVES.map((d, i) => {
              const Icon = d.icon;
              const reverse = i % 2 === 1;
              return (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: reverse ? '1fr 1.4fr' : '1.4fr 1fr',
                  gap: 48, padding: '48px 44px', background: 'var(--bg2)', alignItems: 'center',
                }}>
                  <div style={{ order: reverse ? 2 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: 'var(--surface2)', border: '1px solid var(--border2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}><Icon size={18} color="var(--violet3)" strokeWidth={1.6} /></div>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--violet3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d.tag}</span>
                    </div>
                    <h3 className="serif" style={{ fontSize: 26, color: 'var(--text)', marginBottom: 14 }}>{d.title}</h3>
                    <p style={{ fontSize: 14.5, color: 'var(--text2)', lineHeight: 1.8 }}>{d.desc}</p>
                  </div>
                  <div style={{ order: reverse ? 1 : 2, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {d.points.map((p, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, color: 'var(--text2)' }}>
                        <ArrowRight size={14} color="var(--violet3)" style={{ marginTop: 3, flexShrink: 0 }} />
                        {p}
                      </div>
                    ))}
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
