export default function PageHeader({ eyebrow, title, titleItalic, desc }) {
  return (
    <section style={{
      paddingTop: 168, paddingBottom: 72,
      background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(139,124,246,0.16), transparent), var(--bg)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container aw-fade-up" style={{ textAlign: 'center' }}>
        <div className="eyebrow" style={{ justifyContent: 'center', display: 'flex', marginBottom: 20 }}>{eyebrow}</div>
        <h1 className="serif" style={{
          fontSize: 'clamp(36px,5vw,64px)', color: 'var(--text)', letterSpacing: '-0.01em',
          marginBottom: 18, lineHeight: 1.08,
        }}>
          {title} {titleItalic && <span className="serif-italic gradient-text">{titleItalic}</span>}
        </h1>
        {desc && (
          <p style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 580, margin: '0 auto', lineHeight: 1.7, fontWeight: 350 }}>
            {desc}
          </p>
        )}
      </div>
    </section>
  );
}
