import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    theme: 'dark',
    image: '/hero/slide-broadcast.webp',
    alt: 'Satellite dishes and a broadcast transmission mast at dusk',
    kicker: 'TELECOM & BROADCAST NETWORKS',
    heading: <>Your surplus is<br /><em>someone's network.</em></>,
    body: 'Identify, value, and sell underused telecom and broadcast equipment. Every deal is managed by the AWXchange team.',
    align: 'left',
    actions: [
      { to: '/register', state: { intent: 'seller' }, label: 'Start Selling', variant: 'primary' },
      { to: '/marketplace', label: 'Start Buying', variant: 'ghost' },
    ],
  },
  {
    theme: 'dark',
    image: '/hero/slide-studio.webp',
    alt: 'Television studio with a news desk and overhead lighting grid',
    kicker: 'BROADCAST & STUDIO EQUIPMENT',
    heading: <>Sell smarter.<br /><em>Buy better.</em></>,
    body: 'Connect telecom and broadcast operators through a team-managed marketplace for surplus equipment.',
    align: 'left',
    actions: [
      { to: '/marketplace', label: 'Browse equipment', variant: 'primary' },
      { to: '/features', label: 'How it works', variant: 'ghost' },
    ],
  },
  {
    theme: 'dark',
    image: '/hero/slide-control-room.webp',
    alt: 'Broadcast production control room with monitor wall and mixing consoles',
    kicker: 'PRODUCTION & CONTROL ROOMS',
    heading: <>From dormant<br /><em>to in demand.</em></>,
    body: "Give broadcast and studio equipment a second life while turning yesterday's infrastructure into tomorrow's opportunity.",
    align: 'left',
    actions: [
      { to: '/register', state: { intent: 'seller' }, label: 'List your equipment', variant: 'primary' },
      { to: '/about', label: 'Learn more', variant: 'ghost' },
    ],
  },
];

const DELAY_MS = 6000;
const ARROW_BY_VARIANT = { primary: '↗', dark: '↗', ghost: null, link: '→' };
const CLASS_BY_VARIANT = {
  primary: 'aw-button aw-button--primary',
  dark: 'aw-button aw-button--dark',
  ghost: 'aw-button aw-button--ghost',
  link: 'aw-link',
};

function SlideAction({ action }) {
  const arrow = ARROW_BY_VARIANT[action.variant];
  return (
    <Link to={action.to} state={action.state} className={CLASS_BY_VARIANT[action.variant]}>
      {action.label} {arrow && <span>{arrow}</span>}
    </Link>
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const touchStartRef = useRef(0);
  const effectivePause = paused || hovering;

  const goTo = useCallback((index) => {
    setCurrent(((index % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (effectivePause) return undefined;
    const id = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), DELAY_MS);
    return () => clearInterval(id);
  }, [effectivePause, current]);

  function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === ' ') { e.preventDefault(); setPaused(p => !p); }
  }

  function handleTouchStart(e) {
    touchStartRef.current = e.changedTouches[0].clientX;
  }

  function handleTouchEnd(e) {
    const distance = e.changedTouches[0].clientX - touchStartRef.current;
    if (Math.abs(distance) > 50) goTo(current + (distance < 0 ? 1 : -1));
  }

  const activeSlide = SLIDES[current];

  return (
    <section
      className={`aw-slider${activeSlide.theme === 'light' ? ' is-light' : ''}${effectivePause ? ' is-paused' : ''}`}
      aria-roledescription="carousel"
      aria-label="AWXchange marketplace"
      tabIndex={0}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="aw-slides">
        {SLIDES.map((slide, i) => {
          const isActive = i === current;
          const Heading = i === 0 ? 'h1' : 'h2';
          return (
            <article
              key={i}
              className={`aw-slide aw-slide--${slide.theme}${isActive ? ' is-active' : ''}`}
              aria-hidden={!isActive}
            >
              <img className="aw-slide__image" src={slide.image} alt={slide.alt} loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'} />
              <div className="aw-slide__shade" />
              <div className={`aw-slide__content${slide.align === 'right' ? ' aw-slide__content--right' : ''}`}>
                <span className="aw-kicker"><i />{slide.kicker}</span>
                <Heading>{slide.heading}</Heading>
                <p>{slide.body}</p>
                <div className="aw-actions">
                  {slide.actions.map((action, ai) => <SlideAction key={ai} action={action} />)}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <button className="aw-arrow aw-arrow--prev" type="button" aria-label="Previous slide" onClick={() => goTo(current - 1)}>←</button>
      <button className="aw-arrow aw-arrow--next" type="button" aria-label="Next slide" onClick={() => goTo(current + 1)}>→</button>

      <div className="aw-footer">
        <div className="aw-count"><strong>{String(current + 1).padStart(2, '0')}</strong><span>/ {String(SLIDES.length).padStart(2, '0')}</span></div>
        <div className="aw-dots" role="tablist" aria-label="Select slide">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`aw-dot${i === current ? ' is-active' : ''}`}
              type="button"
              role="tab"
              aria-label={`Slide ${i + 1}`}
              aria-selected={i === current}
              onClick={() => goTo(i)}
            >
              <i key={i === current ? `bar-${current}` : `bar-static-${i}`} />
            </button>
          ))}
        </div>
        <button
          className="aw-pause"
          type="button"
          aria-label={paused ? 'Play automatic slider' : 'Pause automatic slider'}
          onClick={() => setPaused(p => !p)}
        >
          {paused ? '▶' : 'Ⅱ'}
        </button>
      </div>

      <style>{`
.aw-slider{position:relative;width:100%;height:100svh;min-height:680px;overflow:hidden;isolation:isolate;background:#091827;color:#fff}
.aw-slides,.aw-slide{position:absolute;inset:0}.aw-slide{visibility:hidden;opacity:0;transition:opacity .8s ease,visibility .8s}.aw-slide.is-active{visibility:visible;opacity:1;z-index:2}
.aw-slide__image{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;object-position:center;transform:scale(1.035);transition:transform 8s ease}.aw-slide.is-active .aw-slide__image{transform:scale(1)}
.aw-slide__shade{position:absolute;inset:0;background:linear-gradient(90deg,#071522ed,#071522b0 36%,#07152230 72%),linear-gradient(0deg,#07152290,transparent 35%)}
.aw-slide__content{position:absolute;z-index:3;top:50%;left:clamp(32px,6vw,120px);width:min(740px,56vw);transform:translateY(-43%);opacity:0;transition:opacity .5s .15s,transform .6s .15s}.aw-slide.is-active .aw-slide__content{opacity:1;transform:translateY(-50%)}
.aw-kicker{display:flex;align-items:center;gap:12px;font-size:11px;font-weight:600;letter-spacing:.16em;color:#b1d8cc;margin-bottom:28px}.aw-kicker i{width:28px;height:2px;background:#99cbb9}
.aw-slide h1,.aw-slide h2{font-family:var(--font-body);font-size:clamp(48px,5.5vw,88px);font-weight:650;line-height:1.07;letter-spacing:-.055em;color:#fff;margin:0 0 28px}.aw-slide h1 em,.aw-slide h2 em{font-style:normal;color:#b9decf}
.aw-slide__content>p{font-size:17px;line-height:1.85;color:#d0dce5;max-width:570px;margin:0 0 36px}.aw-actions{display:flex;flex-wrap:wrap;gap:12px}.aw-button{display:inline-flex;align-items:center;justify-content:center;gap:14px;padding:15px 22px;min-height:50px;border-radius:6px;font-size:13px;font-weight:650;border:1px solid transparent}.aw-button--primary{background:#fff;color:#152438}.aw-button--ghost{border-color:#ffffff50;background:#ffffff08;color:#fff}.aw-button:hover{background:#dbebe4;color:#152438}
.aw-arrow{position:absolute;z-index:8;top:50%;width:44px;height:44px;border-radius:50%;border:1px solid #ffffff45;background:#0b1a2980;color:#fff;display:grid;place-items:center;transform:translateY(-50%)}.aw-arrow--prev{left:20px}.aw-arrow--next{right:20px}.aw-arrow:hover{background:#ffffff22}
.aw-footer{position:absolute;z-index:9;left:clamp(32px,6vw,120px);right:clamp(32px,6vw,120px);bottom:36px;display:flex;align-items:center;gap:24px}.aw-count{display:flex;align-items:baseline;gap:6px;font-size:12px}.aw-count strong{font-size:14px}.aw-count span{opacity:.5}.aw-dots{display:flex;gap:9px;max-width:280px;flex:1}.aw-dot{position:relative;width:62px;height:24px;border:0;background:none}.aw-dot:before{content:'';position:absolute;inset:11px 0;background:#ffffff35}.aw-dot i{position:absolute;left:0;top:11px;height:2px;width:0;background:#fff}.aw-dot.is-active i{animation:awProgress 6s linear forwards}.aw-slider.is-paused .aw-dot.is-active i{animation-play-state:paused}.aw-pause{border:1px solid #ffffff40;border-radius:50%;width:36px;height:36px;background:transparent;color:#fff}
@keyframes awProgress{from{width:0}to{width:100%}}
@media(max-width:900px){.aw-slide__content{width:min(640px,80vw)}.aw-arrow{top:auto;bottom:30px;transform:none}.aw-arrow--prev{left:auto;right:80px}.aw-arrow--next{right:24px}.aw-footer{right:150px}.aw-slide__image{object-position:65% center}}
@media(max-width:600px){.aw-slider{height:100svh;min-height:720px}.aw-slide__content{top:auto;bottom:130px;left:24px;right:24px;width:auto;transform:translateY(12px)}.aw-slide.is-active .aw-slide__content{transform:translateY(0)}.aw-slide h1,.aw-slide h2{font-size:44px;letter-spacing:-.05em;margin-bottom:24px}.aw-kicker{font-size:9px;margin-bottom:24px}.aw-slide__content>p{font-size:14px;line-height:1.8;margin-bottom:28px}.aw-button{padding:13px 17px;min-height:46px}.aw-slide__shade{background:linear-gradient(180deg,#07152235,#07152265 25%,#071522e8 64%,#071522)}.aw-footer{left:24px;bottom:34px;gap:18px}.aw-dot{width:32px}.aw-pause{display:none}}
@media(prefers-reduced-motion:reduce){.aw-slide,.aw-slide__image,.aw-slide__content{transition:none}.aw-dot.is-active i{animation:none;width:100%}}
      `}</style>
    </section>
  );
}
