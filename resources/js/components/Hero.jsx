import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';



export default function Hero({ brandName, brandSubtext, brandLogo, heroSettings }) {
  const particlesRef = useRef(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [brandLogo]);

  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width  = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let animId;

    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      dots.forEach(d => {
        d.x += d.dx;
        d.y += d.dy;
        if (d.x < 0 || d.x > w) d.dx *= -1;
        if (d.y < 0 || d.y > h) d.dy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(134, 224, 159, ${d.opacity})`;
        ctx.fill();
      });
      // Draw connections
      dots.forEach((a, i) => {
        dots.slice(i + 1).forEach(b => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(134, 224, 159, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(draw);
    };

    draw();
    const onResize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isMorphing, setIsMorphing] = useState(false);
  const [displayTitle, setDisplayTitle] = useState({
    line1: heroSettings?.hero_title_line1_1 || 'Creating',
    accent: heroSettings?.hero_title_accent_1 || 'Infinite',
    line2: heroSettings?.hero_title_line2_1 || 'Possibilities'
  });

  const optionsCount = parseInt(heroSettings?.hero_title_options_count ?? '3', 10);

  const titles = [];
  if (optionsCount >= 1) {
    titles.push({
      line1: heroSettings?.hero_title_line1_1 || 'Creating',
      accent: heroSettings?.hero_title_accent_1 || 'Infinite',
      line2: heroSettings?.hero_title_line2_1 || 'Possibilities'
    });
  }
  if (optionsCount >= 2) {
    titles.push({
      line1: heroSettings?.hero_title_line1_2 || 'Empowering',
      accent: heroSettings?.hero_title_accent_2 || ' Tech',
      line2: heroSettings?.hero_title_line2_2 || ' Leaders'
    });
  }
  if (optionsCount >= 3) {
    titles.push({
      line1: heroSettings?.hero_title_line1_3 || 'Engineering',
      accent: heroSettings?.hero_title_accent_3 || ' Our',
      line2: heroSettings?.hero_title_line2_3 || ' Future'
    });
  }

  // Reset index if it exceeds current titles length
  useEffect(() => {
    if (currentTitleIndex >= titles.length) {
      setCurrentTitleIndex(0);
    }
  }, [titles.length, currentTitleIndex]);

  // Sync initial title if settings load late
  useEffect(() => {
    if (heroSettings) {
      setDisplayTitle({
        line1: heroSettings.hero_title_line1_1 || 'Creating',
        accent: heroSettings.hero_title_accent_1 || 'Infinite',
        line2: heroSettings.hero_title_line2_1 || 'Possibilities'
      });
    }
  }, [heroSettings]);

  useEffect(() => {
    if (titles.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [titles.length]);

  useEffect(() => {
    setIsMorphing(true);
    const timer = setTimeout(() => {
      const nextTitle = titles[currentTitleIndex];
      if (nextTitle) {
        setDisplayTitle(nextTitle);
      }
      setIsMorphing(false);
    }, 400); // Change text halfway through the transition blur
    return () => clearTimeout(timer);
  }, [currentTitleIndex, titles.length]);

  return (
    <section id="hero" className="hero">
      <canvas ref={particlesRef} className="hero__canvas" />
      <div className="hero__overlay" />

      {/* Geometric decorations */}
      <div className="hero__geo hero__geo--1" />
      <div className="hero__geo hero__geo--2" />
      <div className="hero__geo hero__geo--3" />

      <div className="hero__content container">
        {/* Logos */}
        <div className="hero__logos">
          <a
            href="https://olshco.lamparasystem.com/"
            className="hero__logo-link"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit the OLSHCo website"
          >
            <div className="hero__logo-ring">
              <img src="/images/olshco.png" alt="OLSHCo logo" className="hero__logo-img" />
            </div>
          </a>
          <div className="hero__logo-ring">
            {brandLogo && !imgError ? (
              <img src={brandLogo} alt="Logo" className="hero__logo-img"
                onError={() => setImgError(true)} />
            ) : (
              <div className="hero__logo-fallback" style={{ display: 'flex' }}>
                <span>{brandName ? brandName.split('-')[0] : 'JPCS'}</span>
              </div>
            )}
          </div>
        </div>

        <div className="hero__badge hero__badge--stacked">
          <span className="hero__badge-row">
          Our Lady of the Sacred Heart College of Guimba, Inc.
          </span>
          <span className="hero__badge-row">
          {brandSubtext} — {brandName ? brandName.split('-')[1] || 'OLSHCo' : 'OLSHCo'} Chapter
          </span>
        </div>

        <h1 className={`hero__title ${isMorphing ? 'hero__title--morphing' : ''}`}>
          <span className="hero__title-line">{displayTitle.line1}</span>
          <span className="hero__title-accent">{displayTitle.accent}</span>
          <span className="hero__title-line">{displayTitle.line2}</span>
        </h1>

        <p className="hero__tagline">{heroSettings?.hero_tagline || 'Build Dreams. Code Futures.'}</p>
        <p className="hero__motto"><em>"{heroSettings?.hero_motto || 'Ex Fide, Ad Futurum!'}"</em></p>

        <p className="hero__sub">
          We are preparing something innovative for our academic community.
          Join the JPCS family and shape the future of technology.
        </p>

        <div className="hero__actions">
          <a href="#about" className="btn-primary hero__btn"
            onClick={e => { e.preventDefault(); document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Discover More
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#events" className="btn-outline hero__btn hero__btn--outline"
            onClick={e => { e.preventDefault(); document.querySelector('#events')?.scrollIntoView({ behavior: 'smooth' }); }}>
            View Events
          </a>
        </div>

        {/* Stats */}
        <div className="hero__stats">
          {[
            { num: '100+', label: 'Active Members' },
            { num: '20+',  label: 'Events Annually' },
            { num: '5+',   label: 'Years of Excellence' },
          ].map(s => (
            <div key={s.label} className="hero__stat">
              <span className="hero__stat-num">{s.num}</span>
              <span className="hero__stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
