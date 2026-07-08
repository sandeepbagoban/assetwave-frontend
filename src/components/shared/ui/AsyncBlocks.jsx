// Loading/error/empty state blocks, modeled on the already-good patterns
// previously duplicated in Marketplace.jsx and Cart.jsx.

export function LoadingBlock({ label = 'Loading…' }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text3)', fontSize: 14 }}>
      {label}
    </div>
  );
}

export function ErrorBlock({ message, prefix = "Couldn't load" }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--red)', fontSize: 14 }}>
      {prefix}{message ? `: ${message}` : '.'}
    </div>
  );
}

export function EmptyBlock({ icon: Icon, message, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      {Icon && <Icon size={32} color="var(--text4)" style={{ marginBottom: 16 }} />}
      <div style={{ color: 'var(--text3)', fontSize: 14, marginBottom: action ? 20 : 0 }}>{message}</div>
      {action}
    </div>
  );
}
