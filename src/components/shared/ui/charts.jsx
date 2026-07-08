// Hand-rolled SVG charts (no charting library dependency) — extracted from
// the marketing homepage's mockup (components/home/Dashboard.jsx) so the
// same components can render real data on the seller analytics dashboard.

export function Sparkline({ data, color, width = 220, height = 60 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const flat = max === min;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = flat ? height / 2 : height - ((v - min) / (max - min)) * (height - 10) - 5;
    return `${x},${y}`;
  }).join(' ');

  const fillPts = `0,${height} ` + pts + ` ${width},${height}`;
  const gradId = `sg-${color.replace('#', '')}`;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#${gradId})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DonutChart({ data, centerLabel, centerValue, size = 120, stroke = 22 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface2)" strokeWidth={stroke} />
        {data.map((d, i) => {
          const dash = (d.pct / 100) * circ;
          const gap = circ - dash;
          const seg = (
            <circle key={i} cx={size / 2} cy={size / 2} r={r}
              fill="none" stroke={d.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
          offset += dash;
          return seg;
        })}
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--text)', lineHeight: 1 }}>{centerValue}</div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{centerLabel}</div>
      </div>
    </div>
  );
}
