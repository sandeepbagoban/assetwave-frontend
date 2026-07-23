import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    theme: 'dark',
    image: '/hero/slide-camera.png',
    alt: 'Professional cinema camera on a modern display',
    kicker: 'ASSET RECOVERY & MONETIZATION',
    heading: <>Turning dormant assets<br /><em>into working capital.</em></>,
    body: 'Identify, value, and sell underused broadcast equipment through one secure, escrow-protected marketplace.',
    align: 'left',
    actions: [
      { to: '/register', state: { intent: 'seller' }, label: 'Start Selling', variant: 'primary' },
      { to: '/marketplace', label: 'Start Buying', variant: 'ghost' },
    ],
  },
  {
    theme: 'light',
    image: '/hero/slide-lens.png',
    alt: 'Premium professional cinema lens',
    kicker: 'VERIFIED PROFESSIONAL EQUIPMENT',
    heading: <>Sell smarter.<br /><em>Buy better.</em></>,
    body: 'Connect verified broadcasters and media companies across a marketplace built specifically for equipment lifecycle management.',
    align: 'right',
    actions: [
      { to: '/marketplace', label: 'Browse equipment', variant: 'dark' },
      { to: '/features', label: 'How it works', variant: 'link' },
    ],
  },
  {
    theme: 'dark',
    image: '/hero/slide-switcher.png',
    alt: 'Professional broadcast video switcher with illuminated controls',
    kicker: 'UNLOCK HIDDEN VALUE',
    heading: <>From dormant<br /><em>to in demand.</em></>,
    body: "Give equipment a second life while turning yesterday's infrastructure into tomorrow's opportunity.",
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
      aria-label="AssetWave marketplace"
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
              <img className="aw-slide__image" src={slide.image} alt={slide.alt} />
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
        .aw-slider { position: relative; width: 100%; height: clamp(620px, 74vw, 790px); min-height: 620px; overflow: hidden; isolation: isolate; background: #070b1c; --violet: #9d8cff; --cyan: #70ddeb; }
        .aw-slides, .aw-slide { position: absolute; inset: 0; }
        .aw-slide { visibility: hidden; opacity: 0; overflow: hidden; transition: opacity 1s cubic-bezier(.22,1,.36,1), visibility 1s; }
        .aw-slide.is-active { visibility: visible; opacity: 1; z-index: 2; }
        .aw-slide__image { position: absolute; inset: -3%; width: 106%; height: 106%; object-fit: cover; transform: scale(1.06) translateX(1.5%); transition: transform 8s cubic-bezier(.2,.7,.25,1); }
        .aw-slide.is-active .aw-slide__image { transform: scale(1) translateX(0); }
        .aw-slide__shade { position: absolute; inset: 0; background: linear-gradient(90deg, #05091be8 0%, #05091bb5 31%, #05091b24 55%, transparent 72%); }
        .aw-slide--light .aw-slide__shade { background: linear-gradient(90deg, transparent 40%, #faf7f1aa 56%, #faf7f1f3 75%, #faf7f1 100%); }
        .aw-slide__content { position: absolute; z-index: 3; top: 50%; left: clamp(36px, 7vw, 130px); width: min(660px, 49vw); transform: translateY(calc(-50% + 34px)); opacity: 0; transition: transform .9s .22s cubic-bezier(.22,1,.36,1), opacity .8s .22s; }
        .aw-slide.is-active .aw-slide__content { transform: translateY(-50%); opacity: 1; }
        .aw-slide__content--right { right: clamp(36px, 7vw, 130px); left: auto; width: min(600px, 42vw); color: #10111a; }
        .aw-kicker { display: flex; align-items: center; gap: 11px; margin-bottom: 23px; color: var(--violet); font-size: 11px; font-weight: 700; letter-spacing: .17em; }
        .aw-slide--light .aw-kicker { color: #6f55d9; }
        .aw-kicker i { width: 26px; height: 2px; background: var(--cyan); }
        .aw-slide h1, .aw-slide h2 { margin: 0 0 25px; color: #fff; font-size: clamp(48px, 5.3vw, 82px); font-weight: 750; line-height: .98; letter-spacing: -.064em; font-family: var(--font-display), serif; }
        .aw-slide--light h2 { color: #11131a; }
        .aw-slide h1 em, .aw-slide h2 em { color: var(--violet); font-style: normal; }
        .aw-slide__content > p { max-width: 570px; margin: 0 0 34px; color: #b9bfd2; font-size: clamp(15px, 1.2vw, 18px); line-height: 1.72; }
        .aw-slide--light .aw-slide__content > p { color: #5c5d69; }
        .aw-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 14px; }
        .aw-button { display: inline-flex; align-items: center; gap: 10px; padding: 15px 22px; border-radius: 999px; font-size: 13px; font-weight: 650; text-decoration: none; transition: transform .22s ease, background .22s ease, box-shadow .22s ease; }
        .aw-button:hover { transform: translateY(-3px); }
        .aw-button--primary { color: #080b18; background: #fff; box-shadow: 0 12px 35px #0003; }
        .aw-button--primary:hover { box-shadow: 0 15px 40px #0005; }
        .aw-button--ghost { color: #fff; border: 1px solid #ffffff35; background: #ffffff0b; backdrop-filter: blur(12px); }
        .aw-button--dark { color: #fff; background: #11131a; box-shadow: 0 12px 30px #11131a2c; }
        .aw-link { display: inline-flex; gap: 8px; color: #22232b; font-size: 13px; font-weight: 650; text-decoration: none; }
        .aw-arrow { position: absolute; z-index: 8; top: 50%; display: grid; place-items: center; width: 48px; height: 48px; padding: 0; border: 1px solid #ffffff25; border-radius: 50%; color: #fff; background: #070b1c42; cursor: pointer; backdrop-filter: blur(14px); transform: translateY(-50%); transition: background .2s ease, transform .2s ease, color .2s ease; }
        .aw-arrow:hover { background: #ffffff1b; transform: translateY(-50%) scale(1.06); }
        .aw-arrow--prev { left: 24px; }
        .aw-arrow--next { right: 24px; }
        .aw-slider.is-light .aw-arrow { color: #181922; border-color: #11131a1f; background: #fff8; }
        .aw-footer { position: absolute; z-index: 9; right: clamp(36px, 7vw, 130px); bottom: 34px; left: clamp(36px, 7vw, 130px); display: flex; align-items: center; gap: 26px; color: #fff; }
        .aw-count { display: flex; align-items: baseline; gap: 7px; min-width: 54px; }
        .aw-count strong { font-size: 15px; }
        .aw-count span { color: #ffffff6b; font-size: 11px; }
        .aw-dots { display: flex; flex: 1; max-width: 340px; gap: 8px; }
        .aw-dot { position: relative; width: 62px; height: 20px; padding: 9px 0; border: 0; background: transparent; cursor: pointer; }
        .aw-dot::before { content: ""; position: absolute; inset: 9px 0; border-radius: 2px; background: #ffffff31; }
        .aw-dot i { position: absolute; top: 9px; bottom: 9px; left: 0; width: 0; border-radius: 2px; background: #fff; }
        .aw-dot.is-active i { animation: awProgress 6s linear forwards; }
        .aw-slider.is-paused .aw-dot.is-active i { animation-play-state: paused; }
        .aw-pause { width: 38px; height: 38px; border: 1px solid #ffffff26; border-radius: 50%; color: #fff; background: #ffffff0a; cursor: pointer; }
        .aw-slider.is-light .aw-footer { color: #161720; }
        .aw-slider.is-light .aw-count span { color: #16172070; }
        .aw-slider.is-light .aw-dot::before { background: #11131a25; }
        .aw-slider.is-light .aw-dot i { background: #11131a; }
        .aw-slider.is-light .aw-pause { color: #161720; border-color: #11131a25; background: #fff7; }
        @keyframes awProgress { from { width: 0; } to { width: 100%; } }
        @media (max-width: 880px) {
          .aw-slider { height: 760px; }
          .aw-slide__image { inset: 0; width: 100%; height: 100%; object-position: 62% center; }
          .aw-slide--light .aw-slide__image { object-position: 30% center; }
          .aw-slide__shade, .aw-slide--light .aw-slide__shade { background: linear-gradient(180deg, #070b1ca8 0%, #070b1ce8 57%, #070b1c 100%); }
          .aw-slide__content, .aw-slide__content--right { top: auto; right: 30px; bottom: 105px; left: 30px; width: auto; color: #fff; transform: translateY(30px); }
          .aw-slide.is-active .aw-slide__content { transform: translateY(0); }
          .aw-slide--light h2 { color: #fff; }
          .aw-slide--light .aw-kicker { color: #b5aaff; }
          .aw-slide--light .aw-slide__content > p { color: #c4c9d8; }
          .aw-slide--light .aw-button--dark { color: #10111a; background: #fff; }
          .aw-slide--light .aw-link { color: #fff; }
          .aw-arrow { top: 38px; transform: none; }
          .aw-arrow:hover { transform: scale(1.06); }
          .aw-arrow--prev { right: 82px; left: auto; }
          .aw-arrow--next { right: 26px; }
          .aw-footer { right: 30px; bottom: 28px; left: 30px; }
          .aw-slider.is-light .aw-arrow, .aw-slider.is-light .aw-footer, .aw-slider.is-light .aw-pause { color: #fff; }
          .aw-slider.is-light .aw-dot::before { background: #ffffff31; }
          .aw-slider.is-light .aw-dot i { background: #fff; }
        }
        @media (max-width: 560px) {
          .aw-slider { height: 720px; min-height: 720px; }
          .aw-slide h1, .aw-slide h2 { font-size: 44px; }
          .aw-slide__content, .aw-slide__content--right { right: 22px; bottom: 108px; left: 22px; }
          .aw-slide__content > p { margin-bottom: 25px; font-size: 14px; line-height: 1.6; }
          .aw-kicker { font-size: 9px; }
          .aw-actions { gap: 10px; }
          .aw-button { padding: 13px 17px; font-size: 12px; }
          .aw-footer { right: 22px; left: 22px; gap: 14px; }
          .aw-dot { width: 36px; }
          .aw-pause { display: none; }
        }
        @media (prefers-reduced-motion: reduce) { .aw-slide, .aw-slide__content, .aw-slide__image { transition-duration: .01ms; } .aw-dot.is-active i { animation: none; width: 100%; } }
      `}</style>
    </section>
  );
}
