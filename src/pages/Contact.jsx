import { Mail, MessageCircle, Briefcase } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';

const CONTACTS = [
  { icon: Mail, title: 'General enquiries', desc: 'Questions about AssetWave, partnerships, or anything else.', email: 'ceo@awxchange.com' },
  { icon: MessageCircle, title: 'Buyer & seller support', desc: 'Help with an order, listing, or your account.', email: 'support@awxchange.com' },
  { icon: Briefcase, title: 'Operator & seller onboarding', desc: 'Bringing your inventory onto AssetWave.', email: 'sellers@awxchange.com' },
];

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to"
        titleItalic="AssetWave"
        desc="Reach out directly — we read every message ourselves at this stage."
      />

      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="aw-grid-3" style={{ display: 'grid', gap: 20 }}>
            {CONTACTS.map((c, i) => {
              const Icon = c.icon;
              return (
                <a key={i} href={`mailto:${c.email}`} className="aw-card" style={{
                  display: 'block', borderRadius: 18, padding: 26,
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, marginBottom: 16,
                    background: 'var(--surface2)', border: '1px solid var(--border2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon size={18} color="var(--violet3)" strokeWidth={1.6} /></div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{c.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.6, marginBottom: 14 }}>{c.desc}</p>
                  <span style={{ fontSize: 13, color: 'var(--violet3)', fontWeight: 500 }}>{c.email}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
