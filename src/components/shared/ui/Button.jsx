// Shared button encoding the busy/disabled visual pattern duplicated across
// Login/Register/Checkout/ProductDetail/SellerDashboard.

const VARIANTS = {
  primary: { background: 'var(--inverse-bg)', color: 'var(--inverse-text)', border: 'none' },
  secondary: { background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)' },
  ghost: { background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' },
  danger: { background: 'rgba(248,113,113,0.12)', color: 'var(--red)', border: '1px solid rgba(248,113,113,0.3)' },
};

export default function Button({
  variant = 'primary', icon: Icon, busy = false, busyLabel, children,
  style, disabled, ...rest
}) {
  return (
    <button
      disabled={disabled || busy}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '13px 20px', borderRadius: 100, fontSize: 14, fontWeight: 600,
        opacity: (disabled || busy) ? 0.6 : 1, cursor: (disabled || busy) ? 'default' : 'pointer',
        ...VARIANTS[variant],
        ...style,
      }}
      {...rest}
    >
      {Icon && <Icon size={15} />} {busy && busyLabel ? busyLabel : children}
    </button>
  );
}
