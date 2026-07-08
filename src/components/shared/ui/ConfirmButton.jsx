import { useState } from 'react';
import { iconBtnStyle } from './styles';

// Replaces window.confirm with an inline, row-local disclosure — no modal
// system exists in this app and one shouldn't be introduced for a single use.
export default function ConfirmButton({ icon: Icon, confirmLabel = 'Are you sure?', onConfirm, onDone }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    setBusy(true);
    try {
      await onConfirm();
      onDone?.();
    } finally {
      setBusy(false);
      setConfirming(false);
    }
  }

  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} style={iconBtnStyle}>
        {Icon && <Icon size={14} />}
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text2)', whiteSpace: 'nowrap' }}>
      {confirmLabel}
      <button onClick={handleConfirm} disabled={busy} style={{
        background: 'rgba(248,113,113,0.12)', color: 'var(--red)', border: '1px solid rgba(248,113,113,0.3)',
        borderRadius: 100, padding: '5px 12px', fontSize: 12, fontWeight: 600,
        opacity: busy ? 0.6 : 1, cursor: busy ? 'default' : 'pointer',
      }}>{busy ? 'Deleting…' : 'Yes, delete'}</button>
      <button onClick={() => setConfirming(false)} disabled={busy} style={{
        background: 'none', border: 'none', color: 'var(--text3)', fontSize: 12, cursor: busy ? 'default' : 'pointer',
      }}>Cancel</button>
    </div>
  );
}
