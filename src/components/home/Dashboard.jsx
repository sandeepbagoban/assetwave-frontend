import { useEffect, useRef, useState } from 'react';
import { Calendar } from 'lucide-react';

const METRICS = [
  { label: 'Total Assets', value: '18,742', delta: '+8.2%', pos: true },
  { label: 'Total Value', value: '$245.7M', delta: '+12.4%', pos: true },
  { label: 'Surplus Value', value: '$42.8M', delta: '+15.7%', pos: true },
  { label: 'Assets for Sale', value: '1,248', delta: '+10.1%', pos: true },
  { label: 'Revenue Generated', value: '$8.7M', delta: '+22.9%', pos: true },
];

const DONUT_DATA = [
  { label: 'Active', count: '12,394', pct: 67, color: '#8B7CF6' },
  { label: 'Surplus', count: '3,128', pct: 17, color: '#7DD3E8' },
  { label: 'In Review', count: '2,310', pct: 12, color: '#FBBF24' },
  { label: 'Retired', count: '2,787', pct: 15, color: '#475569' },
];

const CATEGORIES = [
  { name: 'Optical Transport', value: '$12.4M' },
  { name: 'Radio Equipment', value: '$8.2M' },
  { name: 'Core Network', value: '$7.1M' },
  { name: 'Power Systems', value: '$5.6M' },
  { name: 'Broadcast Gear', value: '$4.3M' },
];

const SPARKLINE_DATA = [80, 95, 70, 110, 140, 130, 160, 200, 185, 220, 260, 245, 290];

function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 220, h = 60;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(' ');

  const fillPts = `0,${h} ` + pts + ` ${w},${h}`;

  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#sg-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DonutChart({ data }) {
  const size = 120, stroke = 22, r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        {data.map((d, i) => {
          const dash = (d.pct / 100) * circ;
          const gap = circ - dash;
          const seg = (
            <circle key={i} cx={size/2} cy={size/2} r={r}
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
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: '#fff', lineHeight: 1 }}>18,742</div>
        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>Total</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ background: 'var(--bg)', padding: '96px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, alignItems: 'center' }}>
          {/* Left text */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>Real-Time Intelligence</div>
            <h2 className="serif" style={{
              fontSize: 'clamp(28px,3.2vw,42px)',
              color: 'var(--text)', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 16,
            }}>Actionable Insights That Generate Cash</h2>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 32 }}>
              Powerful dashboards give you complete visibility into your assets, value, and monetization opportunities across your entire broadcast portfolio.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Discover hidden value', 'Track performance', 'Optimize decisions', 'Maximize ROI'].map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'rgba(123,94,248,0.15)',
                    border: '1px solid rgba(123,94,248,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5L8 3" stroke="#8B7CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: dashboard mockup — always rendered dark, like a product
              screenshot, regardless of the site's light/dark theme. */}
          <div data-theme="dark" style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            transform: visible ? 'none' : 'translateY(30px)',
            opacity: visible ? 1 : 0,
            transition: 'all .8s ease',
          }}>
            {/* Dashboard header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg3)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--violet)' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Portfolio Overview</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', background: 'var(--surface)', padding: '4px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={12} /> May 1 – May 31, 2025
              </div>
            </div>

            {/* KPI row */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
              borderBottom: '1px solid var(--border)',
            }}>
              {METRICS.map((m, i) => (
                <div key={i} style={{
                  padding: '14px 14px',
                  borderRight: i < 4 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4, fontWeight: 500 }}>{m.label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 400, color: '#fff', lineHeight: 1 }}>{m.value}</div>
                  <div style={{ fontSize: 10, color: '#34D399', marginTop: 3, fontWeight: 600 }}>▲ {m.delta} vs last month</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: 0 }}>
              {/* Donut */}
              <div style={{ padding: 18, borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Assets by Status</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <DonutChart data={DONUT_DATA} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {DONUT_DATA.map(d => (
                      <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 9, color: 'var(--text3)' }}>{d.label}</div>
                          <div style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>{d.count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sparkline */}
              <div style={{ padding: 18, borderRight: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Value Over Time</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', marginBottom: 6 }}>Value (USD)</div>
                <Sparkline data={SPARKLINE_DATA} color="#8B7CF6" />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  {['Dec', 'Feb', 'Apr', 'May'].map(m => (
                    <span key={m} style={{ fontSize: 9, color: 'var(--text4)' }}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Top categories */}
              <div style={{ padding: 18 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Top Surplus Categories</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {CATEGORIES.map((c, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--text2)' }}>{c.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#34D399' }}>{c.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
