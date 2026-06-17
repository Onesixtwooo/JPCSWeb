import React, { useEffect, useRef, useState } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const circleRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [clicks, setClicks] = useState([]);
  
  // Interactive bounding box & charging states
  const [chargeActive, setChargeActive] = useState(false);
  const [chargeProgress, setChargeProgress] = useState(0);
  const [boxActive, setBoxActive] = useState(false);
  const [boxFading, setBoxFading] = useState(false);
  const [boxRect, setBoxRect] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    document.body.classList.add('has-custom-cursor');
    const dot = dotRef.current;
    const circle = circleRef.current;

    let mouseX = -100;
    let mouseY = -100;
    let circleX = -100;
    let circleY = -100;
    let isHidden = true;

    // Selection box tracking variables
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let chargeInterval = null;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (isHidden) {
        isHidden = false;
        setHidden(false);
      }

      // Hardware-accelerated direct DOM updates
      if (dot) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      // Handle bounding box sizing on mouse drag
      if (isDrawing) {
        const currentX = e.clientX;
        const currentY = e.clientY;

        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(startX - currentX);
        const height = Math.abs(startY - currentY);

        setBoxRect({ left, top, width, height });
      }
    };

    const handleMouseLeave = () => {
      isHidden = true;
      setHidden(true);
      
      // Clear charge progress on mouse leave
      if (chargeInterval) {
        clearInterval(chargeInterval);
        chargeInterval = null;
      }
      setChargeActive(false);

      if (isDrawing) {
        isDrawing = false;
        setBoxFading(true);
        setTimeout(() => {
          setBoxActive(false);
          setBoxFading(false);
        }, 350);
      }
    };

    const handleMouseEnter = () => {
      isHidden = false;
      setHidden(false);
    };

    const handleMouseDown = (e) => {
      // 1. Particle block shatter effect
      const id = Date.now() + Math.random();
      setClicks(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setClicks(prev => prev.filter(c => c.id !== id));
      }, 600);

      // 2. Start selection charge logic on left mouse hold
      if (e.button !== 0) return;
      if (chargeInterval) clearInterval(chargeInterval);

      startX = e.clientX;
      startY = e.clientY;
      setChargeActive(true);
      setChargeProgress(0);

      const startTime = Date.now();
      const chargeDuration = 400; // Hold threshold (ms)

      chargeInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min((elapsed / chargeDuration) * 100, 100);
        setChargeProgress(pct);

        if (elapsed >= chargeDuration) {
          clearInterval(chargeInterval);
          chargeInterval = null;
          setChargeActive(false);

          // Trigger bounding box mode
          isDrawing = true;
          setBoxActive(true);
          setBoxFading(false);
          setBoxRect({
            left: startX,
            top: startY,
            width: 0,
            height: 0
          });
        }
      }, 16);
    };

    const handleMouseUp = () => {
      // Clear charge progress on release
      if (chargeInterval) {
        clearInterval(chargeInterval);
        chargeInterval = null;
      }
      setChargeActive(false);

      // Handle selection completion
      if (isDrawing) {
        isDrawing = false;

        setBoxRect(current => {
          // If barely moved, render a default centered bounding box
          if (current.width < 5 && current.height < 5) {
            const defaultSize = 80;
            return {
              left: startX - defaultSize / 2,
              top: startY - defaultSize / 2,
              width: defaultSize,
              height: defaultSize
            };
          }
          return current;
        });

        setBoxFading(true);
        setTimeout(() => {
          setBoxActive(false);
          setBoxFading(false);
        }, 350);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    let animId;
    const updateTrail = () => {
      // smooth circle lag tracking physics
      const dx = mouseX - circleX;
      const dy = mouseY - circleY;
      circleX += dx * 0.16;
      circleY += dy * 0.16;

      if (circle) {
        circle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0)`;
      }

      animId = requestAnimationFrame(updateTrail);
    };

    updateTrail();

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      if (chargeInterval) clearInterval(chargeInterval);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Track hover status on links, buttons, and interactive cards
  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      let isInteractive = false;
      const tagName = target.tagName;
      if (tagName === 'A' || tagName === 'BUTTON' || tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA') {
        isInteractive = true;
      } else if (typeof target.closest === 'function') {
        if (
          target.closest('a') ||
          target.closest('button') ||
          target.closest('.resource-card') ||
          target.closest('.faq-item') ||
          target.closest('.team-card-enverga') ||
          target.closest('.event-card') ||
          target.closest('.news-card') ||
          target.closest('.events__filter-btn') ||
          target.closest('[role="button"]')
        ) {
          isInteractive = true;
        }
      }

      if (!isInteractive && target.nodeType === Node.ELEMENT_NODE) {
        try {
          const style = window.getComputedStyle(target);
          if (style && style.cursor === 'pointer') {
            isInteractive = true;
          }
        } catch (err) {}
      }

      setHovered(isInteractive);
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, []);

  return (
    <>
      {/* 1. Trailing outline cursor (with smooth physics-based lag) */}
      <div
        ref={circleRef}
        className={`custom-gaming-cursor trail ${hovered ? 'hovered' : ''} ${hidden ? 'hidden-cursor' : ''}`}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          pointerEvents: 'none',
          zIndex: 99998,
          transform: 'translate3d(-100px, -100px, 0)',
          transformOrigin: '0 0',
          transition: 'opacity 0.25s ease',
          opacity: 0.35,
        }}
      >
        <div className="custom-gaming-cursor__inner trail-inner">
          <img src="/images/custom_cursor.png" alt="Cursor Trail" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      </div>

      {/* 2. Main solid cursor (instant tracking for precise pointing) */}
      <div
        ref={dotRef}
        className={`custom-gaming-cursor ${hovered ? 'hovered' : ''} ${hidden ? 'hidden-cursor' : ''}`}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          transform: 'translate3d(-100px, -100px, 0)',
          transformOrigin: '0 0',
          transition: 'opacity 0.25s ease',
        }}
      >
        <div className="custom-gaming-cursor__inner">
          <img src="/images/custom_cursor.png" alt="Cursor" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        {/* Radial charge indicator */}
        {chargeActive && (
          <svg className="charge-ring" width="40" height="40" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="15" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2.5" fill="none" />
            <circle 
              cx="20" 
              cy="20" 
              r="15" 
              stroke="#a6ff70" 
              strokeWidth="2.5" 
              fill="none"
              strokeDasharray="94.25"
              strokeDashoffset={94.25 - (94.25 * chargeProgress) / 100}
              strokeLinecap="round"
              transform="rotate(-90 20 20)"
            />
          </svg>
        )}
      </div>

      {/* 3. Click Block Shatter Particles */}
      {clicks.map(click => (
        <div
          key={click.id}
          className="click-block-burst"
          style={{
            left: click.x,
            top: click.y,
          }}
        >
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`block-particle p-${i}`} />
          ))}
        </div>
      ))}

      {/* 4. Selection Bounding Box Overlay */}
      {boxActive && (
        <div
          className={`selection-box ${boxFading ? 'fading' : ''}`}
          style={{
            left: boxRect.left,
            top: boxRect.top,
            width: boxRect.width,
            height: boxRect.height,
            zIndex: 99995,
          }}
        >
          {/* Corner plus signs */}
          <div className="selection-box-corner tl">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V13M1 7H13" stroke="#a6ff70" strokeWidth="2.5" strokeLinecap="square" />
            </svg>
          </div>
          <div className="selection-box-corner tr">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V13M1 7H13" stroke="#a6ff70" strokeWidth="2.5" strokeLinecap="square" />
            </svg>
          </div>
          <div className="selection-box-corner bl">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V13M1 7H13" stroke="#a6ff70" strokeWidth="2.5" strokeLinecap="square" />
            </svg>
          </div>
          <div className="selection-box-corner br">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V13M1 7H13" stroke="#a6ff70" strokeWidth="2.5" strokeLinecap="square" />
            </svg>
          </div>

          {/* Edge dots */}
          <div className="selection-box-dot t1" />
          <div className="selection-box-dot t2" />
          <div className="selection-box-dot b1" />
          <div className="selection-box-dot b2" />
          <div className="selection-box-dot l1" />
          <div className="selection-box-dot l2" />
          <div className="selection-box-dot r1" />
          <div className="selection-box-dot r2" />

          {/* Center white plus sign */}
          <div className="selection-box-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 1V19M1 10H19" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
}
