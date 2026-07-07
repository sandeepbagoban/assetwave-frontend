import PageHeader from '../components/shared/PageHeader';
import ImpactTimeline from '../components/home/ImpactTimeline';
import CaseStudies from '../components/home/CaseStudies';
import CtaBanner from '../components/home/CtaBanner';

const STATS = [
  { value: '$2.4B+', label: 'Asset value identified across the network' },
  { value: '120+', label: 'Countries with active buyers and sellers' },
  { value: '35%', label: 'Average value recovery vs. scrap or storage' },
  { value: '98%', label: 'Valuation accuracy against realized sale price' },
];

export default function Impact() {
  return (
    <>
      <PageHeader
        eyebrow="Impact"
        title="Equipment that finds"
        titleItalic="its next decade"
        desc="Every transaction on AssetWave is equipment that didn't end up in a landfill or a forgotten storage room — and a broadcaster who got access to professional gear they couldn't otherwise afford."
      />

      <section className="section-sm" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)', borderRadius: 20, overflow: 'hidden' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ background: 'var(--bg2)', padding: '36px 28px', textAlign: 'center' }}>
                <div className="serif gradient-text" style={{ fontSize: 'clamp(32px,3.4vw,44px)', marginBottom: 12 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ImpactTimeline />

      <section className="section" style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>The market</div>
          <h2 className="serif" style={{ fontSize: 'clamp(26px,3vw,36px)', color: 'var(--text)', marginBottom: 24 }}>
            Why this matters beyond one transaction
          </h2>
          <p style={{ fontSize: 15.5, color: 'var(--text2)', lineHeight: 1.85, marginBottom: 20 }}>
            The global broadcast equipment market is valued at roughly $7.9 billion and growing &mdash; but that's new equipment. The used market, where AssetWave operates, captures the depreciation gap: equipment too valuable to scrap, too specialized for general resale markets, and too expensive in shipping and verification risk for most broadcasters to trade directly.
          </p>
          <p style={{ fontSize: 15.5, color: 'var(--text2)', lineHeight: 1.85 }}>
            Meanwhile, infrastructure investment across emerging media markets continues to grow, with broadcasters needing professional-grade equipment at a fraction of new-equipment cost. AssetWave exists in that gap &mdash; not as charity, but as a functioning, escrow-protected market that benefits sellers liquidating dormant capital and buyers accessing equipment that would otherwise be out of reach.
          </p>
        </div>
      </section>

      <CaseStudies />
      <CtaBanner />
    </>
  );
}
