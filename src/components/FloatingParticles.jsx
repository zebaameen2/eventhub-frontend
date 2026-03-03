import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import { DEFAULT_PARTICLE_PALETTE } from "../constants/particlePalettes";

/**
 * Single particle state for canvas rendering.
 */
function createParticle(width, height, palette) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    r: 1 + Math.random() * 2,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    phase: Math.random() * Math.PI * 2,
    color: palette[Math.floor(Math.random() * palette.length)],
    alpha: 0.25 + Math.random() * 0.35,
  };
}

/**
 * Subtle floating particle background.
 * - Canvas 2D, capped particle count for 60fps.
 * - pointer-events: none, low z-index so it never blocks UI.
 * - Responsive: resizes with container/window.
 */
function useResponsiveParticleCount(desiredCount) {
  const [count, setCount] = useState(desiredCount);
  useEffect(() => {
    const update = () => {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      setCount(isMobile ? Math.min(28, desiredCount) : Math.min(desiredCount, 80));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [desiredCount]);
  return count;
}

export default function FloatingParticles({
  particleCount = 48,
  palette = DEFAULT_PARTICLE_PALETTE,
  className = "",
  style = {},
  zIndex = 0,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);
  const count = useResponsiveParticleCount(particleCount);

  const initParticles = useCallback((width, height) => {
    const paletteArr = Array.isArray(palette) ? palette : DEFAULT_PARTICLE_PALETTE;
    return Array.from({ length: count }, () =>
      createParticle(width, height, paletteArr)
    );
  }, [count, palette]);

  const draw = useCallback(
    (ctx, width, height, t) => {
      const particles = particlesRef.current;
      if (!particles.length) return;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const drift = Math.sin(t * 0.0008 + p.phase) * 0.3;
        p.x += p.vx + drift * 0.02;
        p.y += p.vy + Math.cos(t * 0.0006 + p.phase) * 0.02;

        if (p.x < -p.r) p.x = width + p.r;
        if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        if (p.y > height + p.r) p.y = -p.r;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.min(1, p.alpha * (0.85 + 0.2 * Math.sin(t * 0.001 + p.phase)));
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
    []
  );

  const loop = useCallback(
    (time) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;
      lastTimeRef.current = time;

      draw(ctx, width, height, time);
      rafRef.current = requestAnimationFrame(loop);
    },
    [draw]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setSize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      const sizeChanged = canvas.width !== w || canvas.height !== h;
      const countChanged = particlesRef.current.length !== count;
      if (sizeChanged) {
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
      }
      if (sizeChanged || countChanged) {
        particlesRef.current = initParticles(w, h);
      }
    };

    setSize();
    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(canvas);

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      resizeObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [initParticles, loop, count]);

  const containerStyle = useMemo(
    () => ({
      position: "fixed",
      inset: 0,
      width: "100%",
      height: "100%",
      zIndex: zIndex,
      pointerEvents: "none",
      overflow: "hidden",
    }),
    [zIndex]
  );

  return (
    <div
      className={className}
      style={{ ...containerStyle, ...style }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
