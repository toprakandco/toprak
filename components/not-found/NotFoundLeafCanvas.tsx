'use client';

import { useEffect, useRef } from 'react';

const LEAF = 'M16 4c-6 8-10 18-8 28 4-2 8-8 10-16 2 10 0 20-6 26 8-4 14-14 16-24-2-6-6-11-12-14z';

type Particle = {
  x: number;
  y: number;
  phase: number;
  speed: number;
  scale: number;
  drift: number;
};

/**
 * Az sayıda yüzen yaprak — homepage hero’daki SVG yapraklara benzer, canvas ile hafif drift.
 */
export function NotFoundLeafCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = ref.current;
    if (!canvasEl) return;
    const canvas = canvasEl;
    const ctxRaw = canvas.getContext('2d');
    if (!ctxRaw) return;
    const ctx: CanvasRenderingContext2D = ctxRaw;

    const dpr = Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];

    const path = new Path2D(LEAF);

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = [
        { x: w * 0.12, y: h * 0.22, phase: 0, speed: 0.35, scale: 0.55, drift: 1.1 },
        { x: w * 0.78, y: h * 0.18, phase: 1.2, speed: 0.28, scale: 0.45, drift: -0.9 },
        { x: w * 0.88, y: h * 0.62, phase: 2.1, speed: 0.32, scale: 0.5, drift: 0.7 },
        { x: w * 0.18, y: h * 0.72, phase: 0.6, speed: 0.3, scale: 0.4, drift: -0.6 },
      ];
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    let raf = 0;
    const t0 = performance.now();

    function frame(now: number) {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        const bob = Math.sin(t * p.speed + p.phase) * 10;
        const sway = Math.sin(t * 0.4 + p.phase * 2) * 6 * p.drift;
        const x = p.x + sway;
        const y = p.y + bob;
        const rot = Math.sin(t * 0.25 + p.phase) * 0.35;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.scale(p.scale, p.scale);
        ctx.translate(-16, -20);
        ctx.fillStyle = 'rgba(122, 158, 110, 0.09)';
        ctx.fill(path);
        ctx.restore();
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
