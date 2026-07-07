export default function CtaBanner() {
  return (
    <section style={{ padding: '0 0 96px' }}>
      <div className="container">
        <div style={{
          background: 'linear-gradient(135deg, #1A1140 0%, #2A1B5E 100%)',
          border: '1px solid rgba(123,94,248,0.25)',
          borderRadius: 20,
          padding: '36px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 32, flexWrap: 'wrap',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -60, top: -60,
            width: 220, height: 220, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(123,94,248,0.25) 0%, transparent 70%)',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative', zIndex: 1, flex: 1, minWidth: 280 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: 'rgba(123,94,248,0.2)',
              border: '1px solid rgba(123,94,248,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>💰</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                Unlock the value in your assets.
              </div>
              <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, maxWidth: 460 }}>
                Keep your current asset management system. Connect it to our platform — we'll identify dormant assets and turn them into real working capital.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1, flexShrink: 0 }}>
            <button style={{
              background: 'linear-gradient(135deg, #7B5EF8, #6347E0)',
              border: 'none', color: '#fff', padding: '13px 24px',
              borderRadius: 10, fontSize: 14, fontWeight: 600,
              boxShadow: '0 6px 20px rgba(123,94,248,0.4)',
              whiteSpace: 'nowrap',
              transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
              Request a Demo →
            </button>
            <button style={{
              background: 'transparent', border: '1px solid var(--border2)',
              color: '#fff', padding: '13px 24px',
              borderRadius: 10, fontSize: 14, fontWeight: 500,
              whiteSpace: 'nowrap', transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple3)'; e.currentTarget.style.color = 'var(--purple3)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = '#fff'; }}>
              Talk to an Expert
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
