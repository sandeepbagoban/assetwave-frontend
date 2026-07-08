// Shared style objects for forms/cards, extracted from the near-identical
// literals previously duplicated across Login/Register/Checkout/SellerDashboard.
// Pages may still spread overrides: style={{...inputStyle, padding:'11px 14px'}}

export const inputStyle = {
  width: '100%', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10,
  padding: '12px 16px', color: 'var(--text)', fontSize: 14, outline: 'none',
};

export const labelStyle = { display: 'block', fontSize: 13, color: 'var(--text3)', marginBottom: 8, fontWeight: 500 };

export const cardStyle = {
  background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 18, padding: 24,
  boxShadow: 'var(--shadow-card)',
};

export const iconBtnStyle = {
  width: 32, height: 32, borderRadius: 8, background: 'var(--surface2)', border: '1px solid var(--border)',
  color: 'var(--text2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};
