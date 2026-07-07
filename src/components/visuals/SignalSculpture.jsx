// A glowing "signal sculpture" — AssetWave's equivalent of the reference's
// crystal bonsai centerpiece. Built as layered SVG with CSS animation
// rather than a 3D library, to keep the bundle light while still reading
// as a premium, crafted hero visual.
export default function SignalSculpture() {
  return (
    <div style={{
      position: 'relative', width: '100%', maxWidth: 420, margin: '0 auto',
      animation: 'float 7s ease-in-out infinite',
    }}>
      {/* Ambient glow behind */}
      <div style={{
        position: 'absolute', inset: '-20%',
        background: 'radial-gradient(circle at 50% 45%, rgba(139,124,246,0.35) 0%, rgba(125,211,232,0.12) 40%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'pulseGlow 5s ease-in-out infinite',
      }} />

      <svg viewBox="0 0 420 460" width="100%" style={{ position: 'relative', zIndex: 1 }}>
        <defs>
          <linearGradient id="stem" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#5B4FC4" />
            <stop offset="100%" stopColor="#7DD3E8" />
          </linearGradient>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C9BFFA" stopOpacity="1" />
            <stop offset="60%" stopColor="#8B7CF6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8B7CF6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nodeGlowCyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D6F5FB" stopOpacity="1" />
            <stop offset="60%" stopColor="#7DD3E8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7DD3E8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="diskGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B4A9FB" />
            <stop offset="100%" stopColor="#7DD3E8" />
          </linearGradient>
          <filter id="blurSm"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>

        {/* Base platform / disk (the "antenna base") */}
        <ellipse cx="210" cy="410" rx="120" ry="16" fill="url(#diskGrad)" opacity="0.12" />
        <ellipse cx="210" cy="406" rx="92" ry="11" fill="url(#diskGrad)" opacity="0.22" />
        <ellipse cx="210" cy="402" rx="60" ry="7" fill="url(#diskGrad)" opacity="0.4" />

        {/* Central mast */}
        <line x1="210" y1="400" x2="210" y2="120" stroke="url(#stem)" strokeWidth="3" strokeLinecap="round" />

        {/* Branching struts — like a transmission tower / antenna array */}
        {[
          { y: 360, len: 70, angle: 28 },
          { y: 300, len: 85, angle: 22 },
          { y: 240, len: 95, angle: 18 },
          { y: 180, len: 78, angle: 24 },
        ].map((s, i) => {
          const rad = (s.angle * Math.PI) / 180;
          const dx = Math.sin(rad) * s.len;
          const dy = -Math.cos(rad) * s.len * 0.3;
          return (
            <g key={i}>
              <line x1="210" y1={s.y} x2={210 - dx} y2={s.y + dy} stroke="url(#stem)" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
              <line x1="210" y1={s.y} x2={210 + dx} y2={s.y + dy} stroke="url(#stem)" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            </g>
          );
        })}

        {/* Glowing signal nodes at strut tips */}
        {[
          { x: 130, y: 339, r: 26, grad: 'nodeGlow', core: '#C9BFFA', delay: '0s' },
          { x: 290, y: 339, r: 22, grad: 'nodeGlowCyan', core: '#9FE6F2', delay: '.4s' },
          { x: 108, y: 274, r: 30, grad: 'nodeGlow', core: '#B4A9FB', delay: '.8s' },
          { x: 312, y: 274, r: 26, grad: 'nodeGlowCyan', core: '#7DD3E8', delay: '1.2s' },
          { x: 96, y: 211, r: 34, grad: 'nodeGlow', core: '#A192F9', delay: '.2s' },
          { x: 324, y: 211, r: 30, grad: 'nodeGlowCyan', core: '#8FE0EE', delay: '.6s' },
          { x: 132, y: 154, r: 24, grad: 'nodeGlow', core: '#C9BFFA', delay: '1s' },
          { x: 288, y: 154, r: 22, grad: 'nodeGlowCyan', core: '#9FE6F2', delay: '1.4s' },
          { x: 210, y: 105, r: 30, grad: 'nodeGlow', core: '#D6CFFC', delay: '0s' },
        ].map((n, i) => (
          <g key={i} style={{ transformOrigin: `${n.x}px ${n.y}px`, animation: `pulseGlow ${3 + (i % 3)}s ease-in-out infinite`, animationDelay: n.delay }}>
            <circle cx={n.x} cy={n.y} r={n.r} fill={`url(#${n.grad})`} />
            <circle cx={n.x} cy={n.y} r={n.r * 0.22} fill={n.core} />
          </g>
        ))}

        {/* Top beacon */}
        <circle cx="210" cy="90" r="6" fill="#fff" opacity="0.9" />
        <circle cx="210" cy="90" r="14" fill="url(#nodeGlowCyan)" />

        {/* Signal rings emanating from top */}
        {[0, 1, 2].map(i => (
          <circle key={i} cx="210" cy="90" r="0" stroke="#7DD3E8" strokeWidth="1.2" fill="none"
            style={{
              animation: `ringPulse 3.5s ease-out infinite`,
              animationDelay: `${i * 1.1}s`,
              transformOrigin: '210px 90px',
            }} />
        ))}
      </svg>

      <style>{`
        @keyframes ringPulse {
          0% { r: 6; opacity: 0.8; stroke-width: 2; }
          100% { r: 70; opacity: 0; stroke-width: 0.3; }
        }
      `}</style>
    </div>
  );
}
