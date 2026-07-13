// Structured rows/columns for dashboard lists — rounder and softer than a
// typical admin-CRUD table (row hover via .aw-table-row in index.css),
// but still a real table so dense data (orders, listings) reads cleanly.
export default function Table({ columns, rows, rowKey = 'id', emptyMessage = 'No records found.' }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="aw-surface" style={{ borderRadius: 16, padding: '32px 0', textAlign: 'center', color: 'var(--text3)', fontSize: 13.5 }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="aw-surface" style={{ borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg3)' }}>
              {columns.map(col => (
                <th key={col.key} style={{
                  textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 600, color: 'var(--text3)',
                  textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
                }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row[rowKey] ?? i} className="aw-table-row" style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '14px 16px', fontSize: 13.5, color: 'var(--text2)', verticalAlign: 'top' }}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
