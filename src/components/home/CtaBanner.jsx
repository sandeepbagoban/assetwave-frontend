import { Sparkles, ArrowRight } from 'lucide-react';

export default function CtaBanner() {
  return (
    <section style={{ padding: '0 0 120px' }}>
      <div className="container">
        <div style={{
          background: 'linear-gradient(135deg, #161028 0%, #0F0F1A 100%)',
          border: '1px solid var(--border2)',
          borderRadius: 28,
          padding: '44px 48px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 32, flexWrap: 'wrap',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -80, top: -80,
            width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,124,246,0.28) 0%, transparent 70%)',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 22, position: 'relative', zIndex: 1, flex: 1, minWidth: 300 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, flexShrink: 0,
              background: 'var(--surface2)',
              border: '1px solid var(--border2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Sparkles size={24} color="var(--violet3)" strokeWidth={1.5} /></div>
            <div>
              <h3 className="serif" style={{ fontSize: 24, color: '#fff', marginBottom: 6 }}>
                Unlock the value in your assets
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, maxWidth: 460 }}>
                Keep your current asset management system. Connect it to AssetWave — we'll identify dormant assets and turn them into real working capital.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1, flexShrink: 0 }}>
            <button style={{
              background: '#fff', color: '#0A0A12', border: 'none', padding: '14px 26px',
              borderRadius: 100, fontSize: 14, fontWeight: 600,
              whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
              Request a Demo <ArrowRight size={15} />
            </button>
            <button style={{
              background: 'transparent', border: '1px solid var(--border2)',
              color: '#fff', padding: '14px 26px',
              borderRadius: 100, fontSize: 14, fontWeight: 500,
              whiteSpace: 'nowrap', transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet3)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; }}>
              Talk to an Expert
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
