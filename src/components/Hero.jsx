import { useEffect, useRef } from 'react';
import { usePlatformStats } from '../hooks/useListings';

// Formats the raw stats object (from mocks or the real backend) into
// the icon/value/label shape this component renders. Keeping this
// mapping here — rather than in the API layer — means the backend
// only ever needs to return plain numeric fields.
function formatStats(stats) {
  if (!stats) return [];
  const fmtUsd = n => `$${(n / 1_000_000_000).toFixed(1)}B+`;
  return [
    { icon: '🗄️', value: fmtUsd(stats.asset_value_identified_usd), label: 'Asset Value Identified' },
    { icon: '📦', value: `${stats.equipment_models.toLocaleString()}+`, label: 'Equipment Models From Leading Broadcast Brands' },
    { icon: '🌐', value: `${stats.countries}+`, label: 'Countries with Buyers & Sellers' },
    { icon: '🎯', value: `${stats.valuation_accuracy_pct}%`, label: 'Valuation Accuracy (Market Data)' },
    { icon: '📈', value: `${stats.avg_value_recovery_pct}%`, label: 'Average Value Recovery for Clients' },
  ];
}

function GlobeCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // City light points (lat/lon → x/y on tilted ellipse)
    const cities = [
      [51.5, -0.1], [48.8, 2.3], [40.7, -74], [34.0, -118],
      [-33.9, 18.4], [1.3, 103.8], [35.7, 139.7], [-23.5, -46.6],
      [55.7, 37.6], [28.6, 77.2], [19.1, 72.9], [31.2, 121.5],
      [6.5, 3.4], [-1.3, 36.8], [14.7, -17.4], [4.0, 9.7],
      [33.9, -6.9], [30.0, 31.2], [24.7, 46.7], [25.2, 55.3],
      [59.3, 18.1], [52.4, 13.0], [41.0, 29.0], [37.6, -122.4],
      [47.6, -122.3], [43.7, -79.4], [19.4, -99.1], [-34.6, -58.4],
    ];

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const project = (lat, lon, rotation) => {
      const r = lon + rotation;
      const rLat = (lat * Math.PI) / 180;
      const rLon = (r * Math.PI) / 180;
      const cx = W() * 0.52, cy = H() * 0.5;
      const rx = Math.min(W(), H()) * 0.36;
      const ry = rx * 0.95;
      const x = cx + rx * Math.cos(rLat) * Math.sin(rLon);
      const y = cy - ry * Math.sin(rLat);
      const z = Math.cos(rLat) * Math.cos(rLon);
      return { x, y, z };
    };

    const draw = () => {
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);
      const cx = w * 0.52, cy = h * 0.5;
      const rx = Math.min(w, h) * 0.36;

      // Outer glow
      const grd = ctx.createRadialGradient(cx, cy, rx * 0.1, cx, cy, rx * 1.4);
      grd.addColorStop(0, 'rgba(123,94,248,0.08)');
      grd.addColorStop(0.5, 'rgba(34,211,238,0.04)');
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, w, h);

      // Globe base
      const globeGrd = ctx.createRadialGradient(cx - rx * 0.2, cy - rx * 0.2, rx * 0.05, cx, cy, rx);
      globeGrd.addColorStop(0, 'rgba(123,94,248,0.18)');
      globeGrd.addColorStop(0.5, 'rgba(17,24,48,0.9)');
      globeGrd.addColorStop(1, 'rgba(6,9,26,0.95)');
      ctx.beginPath();
      ctx.arc(cx, cy, rx, 0, Math.PI * 2);
      ctx.fillStyle = globeGrd;
      ctx.fill();

      // Globe border glow
      const borderGrd = ctx.createLinearGradient(cx - rx, cy, cx + rx, cy);
      borderGrd.addColorStop(0, 'rgba(123,94,248,0.6)');
      borderGrd.addColorStop(0.5, 'rgba(34,211,238,0.4)');
      borderGrd.addColorStop(1, 'rgba(123,94,248,0.3)');
      ctx.beginPath();
      ctx.arc(cx, cy, rx, 0, Math.PI * 2);
      ctx.strokeStyle = borderGrd;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Latitude lines
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        const rLat = (lat * Math.PI) / 180;
        const lineRx = rx * Math.cos(rLat);
        const lineY = cy - rx * 0.95 * Math.sin(rLat);
        ctx.ellipse(cx, lineY, lineRx, lineRx * 0.08, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Longitude lines
      for (let lon = 0; lon < 360; lon += 30) {
        ctx.beginPath();
        const rLon = ((lon + t) * Math.PI) / 180;
        for (let lat = -90; lat <= 90; lat += 3) {
          const rLat = (lat * Math.PI) / 180;
          const x = cx + rx * Math.cos(rLat) * Math.sin(rLon);
          const y = cy - rx * 0.95 * Math.sin(rLat);
          const z = Math.cos(rLat) * Math.cos(rLon);
          if (z > 0) {
            if (lat === -90) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.035)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // City dots + connection lines
      const rotation = t;
      const visible = cities.map(([lat, lon]) => {
        const p = project(lat, lon, rotation);
        return { ...p, lat, lon };
      }).filter(p => p.z > 0.05);

      // Connections
      visible.forEach((a, i) => {
        visible.slice(i + 1, i + 3).forEach(b => {
          const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (dist < rx * 0.9) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            const mx = (a.x + b.x) / 2 + (Math.random() - 0.5) * 10;
            const my = (a.y + b.y) / 2 - dist * 0.3;
            ctx.quadraticCurveTo(mx, my, b.x, b.y);
            const opacity = Math.min(a.z, b.z) * 0.35;
            ctx.strokeStyle = `rgba(123,94,248,${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        });
      });

      // City glow dots
      visible.forEach(({ x, y, z }) => {
        const size = 1.5 + z * 2;
        // Outer glow
        const g = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
        g.addColorStop(0, `rgba(34,211,238,${z * 0.6})`);
        g.addColorStop(1, 'rgba(34,211,238,0)');
        ctx.beginPath();
        ctx.arc(x, y, size * 4, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,230,255,${z * 0.9})`;
        ctx.fill();
      });

      // Atmosphere ring
      const atmo = ctx.createRadialGradient(cx, cy, rx * 0.95, cx, cy, rx * 1.12);
      atmo.addColorStop(0, 'rgba(123,94,248,0.12)');
      atmo.addColorStop(0.5, 'rgba(34,211,238,0.06)');
      atmo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, rx * 1.12, 0, Math.PI * 2);
      ctx.fillStyle = atmo;
      ctx.fill();

      t += 0.08;
      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none',
    }} />
  );
}

export default function Hero() {
  const { data: rawStats, loading } = usePlatformStats();
  const STATS = formatStats(rawStats);
  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      background: 'var(--bg)',
      overflow: 'hidden', paddingTop: 68,
    }}>
      {/* Starfield */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse at 60% 50%, rgba(123,94,248,0.12) 0%, transparent 60%),
          radial-gradient(ellipse at 20% 80%, rgba(34,211,238,0.06) 0%, transparent 50%)
        `,
      }} />

      {/* Stars */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(80)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() > 0.8 ? 2 : 1,
            height: Math.random() > 0.8 ? 2 : 1,
            borderRadius: '50%',
            background: 'rgba(255,255,255,' + (0.2 + Math.random() * 0.6) + ')',
            animation: `twinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          0%,100% { opacity: 1; } 50% { opacity: 0.2; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Globe */}
      <div style={{
        position: 'absolute', right: '0%', top: '50%',
        transform: 'translateY(-50%)',
        width: '55%', height: '90vh',
        maxHeight: 800,
      }}>
        <GlobeCanvas />
      </div>

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'center', width: '100%' }}>
        {/* Left: text */}
        <div style={{ animation: 'fadeUp .8s ease both' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(123,94,248,0.12)', border: '1px solid rgba(123,94,248,0.3)',
            borderRadius: 20, padding: '6px 14px', marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7B5EF8', boxShadow: '0 0 6px #7B5EF8' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--purple3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Broadcast & Media Asset Intelligence
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1.08, marginBottom: 6 }}>
            <div style={{ fontSize: 'clamp(28px,3.5vw,48px)', color: '#fff' }}>Broadcast & Media</div>
            <div style={{
              fontSize: 'clamp(30px,4vw,54px)',
              background: 'linear-gradient(135deg, #7B5EF8 0%, #22D3EE 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Asset Intelligence</div>
            <div style={{ fontSize: 'clamp(28px,3.5vw,48px)', color: '#fff' }}>Platform</div>
          </h1>

          <div style={{
            width: 48, height: 3, borderRadius: 2,
            background: 'linear-gradient(90deg, #7B5EF8, #22D3EE)',
            margin: '18px 0',
          }} />

          <p style={{ fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 10 }}>
            Turn Dormant Broadcast & Media<br />Assets Into Cash.
          </p>
          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}>
            Connect your existing asset management systems. We identify surplus equipment, determine market value, and help monetize underutilized infrastructure across 120+ countries.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button style={{
              background: 'linear-gradient(135deg, #7B5EF8, #6347E0)',
              border: 'none', color: '#fff', padding: '13px 28px',
              borderRadius: 10, fontSize: 15, fontWeight: 600,
              boxShadow: '0 6px 24px rgba(123,94,248,0.4)',
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(123,94,248,0.55)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(123,94,248,0.4)'; }}>
              Request a Demo →
            </button>
            <button style={{
              background: 'transparent',
              border: '1px solid var(--border2)',
              color: '#fff', padding: '13px 28px',
              borderRadius: 10, fontSize: 15, fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple3)'; e.currentTarget.style.color = 'var(--purple3)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = '#fff'; }}>
              ▶ See Platform Overview
            </button>
          </div>
        </div>

        {/* Right: Stats panel */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          borderRadius: 20, padding: 28,
          backdropFilter: 'blur(20px)',
          animation: 'fadeUp .8s .2s ease both',
          opacity: 0,
        }}>
          {loading && (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
              Loading platform stats…
            </div>
          )}
          {!loading && STATS.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '16px 0',
              borderBottom: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'rgba(123,94,248,0.15)',
                border: '1px solid rgba(123,94,248,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}>{s.icon}</div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800,
                  color: '#fff', lineHeight: 1.1, letterSpacing: '-0.5px',
                }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
