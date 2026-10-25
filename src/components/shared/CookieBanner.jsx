import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'awxchange_cookie_consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function decide(choice) {
    try { localStorage.setItem(STORAGE_KEY, choice); } catch { /* best-effort */ }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div role="region" aria-label="Cookie preferences" style={{
      position: 'fixed', left: 16, right: 16, bottom: 16, zIndex: 2000,
      maxWidth: 640, margin: '0 auto',
      background: 'var(--glass)', backdropFilter: 'blur(20px) saturate(160%)',
      border: '1px solid var(--border2)', borderRadius: 18,
      padding: '20px 24px', boxShadow: 'var(--shadow-lg)',
      display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
    }}>
      <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, flex: 1, minWidth: 220, margin: 0 }}>
        We use essential cookies and local storage to keep you signed in and remember your preferences. We do not use advertising or analytics cookies. See our{' '}
        <Link to="/privacy#cookies" style={{ color: 'var(--violet3)' }}>Cookie Policy</Link> for details.
      </p>
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button onClick={() => decide('declined')} style={{
          background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text2)',
          padding: '10px 18px', borderRadius: 100, fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}>Essential only</button>
        <button onClick={() => decide('accepted')} style={{
          background: 'var(--inverse-bg)', border: 'none', color: 'var(--inverse-text)',
          padding: '10px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer',
        }}>Accept</button>
      </div>
    </div>
  );
}
