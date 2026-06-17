import React, { useEffect, useRef } from 'react';

export default function CanvasLines() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isVisible = false; // Tracks if the section is in the viewport

    // Track width & height
    const parent = canvas.parentElement;
    let w = canvas.width = parent ? parent.clientWidth : window.innerWidth;
    let h = canvas.height = parent ? parent.clientHeight : window.innerHeight;

    // Mouse coordinates (with physical trail lag interpolation)
    const targetMouse = { x: -1000, y: -1000 };
    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse.x = e.clientX - rect.left;
      targetMouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      targetMouse.x = -1000;
      targetMouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Resize observer to handle container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        w = canvas.width = width;
        h = canvas.height = height;
      }
    });

    if (parent) {
      resizeObserver.observe(parent);
    }

    // Intersection observer to only run animation when canvas is visible
    const intersectionObserver = new IntersectionObserver((entries) => {
      for (let entry of entries) {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animationFrameId);
          draw();
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      }
    }, { threshold: 0.01 });

    intersectionObserver.observe(canvas);

    let time = 0;

    const draw = () => {
      if (!isVisible) return; // Pause rendering if offscreen

      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      // Smooth mouse tracking interpolation for trail physics
      if (targetMouse.x !== -1000) {
        if (mouse.x === -1000) {
          mouse.x = targetMouse.x;
          mouse.y = targetMouse.y;
        } else {
          mouse.x += (targetMouse.x - mouse.x) * 0.12;
          mouse.y += (targetMouse.y - mouse.y) * 0.12;
        }
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      const spacing = 18; // 18px is tight but saves ~45% math overhead compared to 15px
      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;

      time += 0.005; // Slow breathing wave speed

      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          const cx = col * spacing;
          const cy = row * spacing;

          // Sizing wave formulas
          const wave = Math.sin(col * 0.11 + time) * Math.cos(row * 0.11 + time * 0.55);
          const sizeFactor = (wave + 1) / 2; // Normalize to 0..1
          const baseSize = sizeFactor * 4.2 + 1.2; // Size varies from 1.2px to 5.4px

          // Fast distance squared check (avoids Math.sqrt math overhead inside nested loop)
          const dx = cx - mouse.x;
          const dy = cy - mouse.y;
          const distSq = dx * dx + dy * dy;
          const hoverRadius = 110;
          const hoverRadiusSq = hoverRadius * hoverRadius; // 12100

          // Checkerboard baseline colors
          const isGreenBase = (col + row) % 2 === 0;
          let finalColor = '';

          if (distSq < hoverRadiusSq) {
            // Only compute square root for coordinates inside hover range
            const dist = Math.sqrt(distSq);
            const ratio = 1 - dist / hoverRadius;
            const easedRatio = ratio * ratio;

            if (isGreenBase) {
              // Green squares turn White under hover
              const r = Math.round(34 + (255 - 34) * easedRatio);
              const g = Math.round(132 + (255 - 132) * easedRatio);
              const b = Math.round(59 + (255 - 59) * easedRatio);
              const alpha = 0.14 + (0.9 - 0.14) * easedRatio;
              finalColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            } else {
              // White squares turn Green under hover
              const r = Math.round(255 - (255 - 34) * easedRatio);
              const g = Math.round(255 - (255 - 132) * easedRatio);
              const b = Math.round(255 - (255 - 59) * easedRatio);
              const alpha = 0.85 - (0.85 - 0.55) * easedRatio;
              finalColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            }
          } else {
            // Default base color state
            if (isGreenBase) {
              finalColor = 'rgba(34, 132, 59, 0.14)';
            } else {
              finalColor = 'rgba(255, 255, 255, 0.85)';
            }
          }

          // Draw the halftone grid square
          ctx.beginPath();
          ctx.rect(cx - baseSize / 2, cy - baseSize / 2, baseSize, baseSize);
          ctx.fillStyle = finalColor;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
