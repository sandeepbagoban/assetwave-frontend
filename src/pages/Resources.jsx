import { FileText, HelpCircle, BookOpen, ArrowUpRight } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import CtaBanner from '../components/home/CtaBanner';

const GUIDES = [
  { tag: 'Sellers', title: 'How to price surplus broadcast equipment', desc: 'A practical framework for setting listing prices that sell without leaving money on the table.' },
  { tag: 'Sellers', title: 'KYB verification: what to prepare', desc: 'Documents and information you’ll need to get your organization verified and listing within days.' },
  { tag: 'Buyers', title: 'Reading a condition grade correctly', desc: 'What "excellent", "good", and "fair" actually mean for transmitters, cameras, and consoles.' },
  { tag: 'Buyers', title: 'Understanding the inspection window', desc: 'How the 5-day window works, what counts as a valid dispute, and how resolutions are decided.' },
  { tag: 'Logistics', title: 'Cross-border shipping checklist', desc: 'Customs documentation, insurance, and packaging standards for high-value broadcast freight.' },
  { tag: 'Trust & Safety', title: 'How escrow protects both sides', desc: 'A walkthrough of where your money sits at each stage of a transaction, and why.' },
];

const SUPPORT_LINKS = [
  { icon: HelpCircle, title: 'Help Center', desc: 'Answers to common questions about buying, selling, and verification.' },
  { icon: FileText, title: 'Seller Guidelines', desc: 'Listing standards, prohibited items, and photo requirements.' },
  { icon: BookOpen, title: 'API & Integration Docs', desc: 'Technical documentation for connecting your asset management system.' },
];

export default function Resources() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Everything you need to"
        titleItalic="trade with confidence"
        desc="Guides for sellers and buyers, written from real questions our verification and support team hears every week."
      />

      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div className="aw-grid-3" style={{ display: 'grid', gap: 20, marginBottom: 24 }}>
            {SUPPORT_LINKS.map((s, i) => {
              const Icon = s.icon;
              return (
                <a key={i} href="#" className="aw-card" style={{
                  display: 'block', borderRadius: 18, padding: 26,
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, marginBottom: 16,
                    background: 'var(--surface2)', border: '1px solid var(--border2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon size={18} color="var(--violet3)" strokeWidth={1.6} /></div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {s.title} <ArrowUpRight size={13} color="var(--text3)" />
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.6 }}>{s.desc}</p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="eyebrow" style={{ marginBottom: 16 }}>Guides</div>
          <h2 className="serif" style={{ fontSize: 'clamp(28px,3.2vw,40px)', color: 'var(--text)', marginBottom: 48, letterSpacing: '-0.01em' }}>
            Practical, not generic
          </h2>
          <div className="aw-grid-3" style={{ display: 'grid', gap: 20 }}>
            {GUIDES.map((g, i) => (
              <a key={i} href="#" className="aw-card" style={{
                display: 'block', borderRadius: 16, padding: 24,
              }}>
                <span style={{
                  fontSize: 10.5, fontWeight: 600, color: 'var(--violet3)', textTransform: 'uppercase',
                  letterSpacing: '0.05em', marginBottom: 12, display: 'inline-block',
                }}>{g.tag}</span>
                <h3 style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--text)', marginBottom: 10, lineHeight: 1.4 }}>{g.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.65 }}>{g.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
