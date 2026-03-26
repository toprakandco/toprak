'use client';

import { useEffect, useRef, useState } from 'react';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function CustomCursor() {
  const smallRef = useRef<HTMLDivElement>(null);
  const largeRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)');
    if (mq.matches || coarse.matches) {
      setDisabled(true);
      return;
    }
    setDisabled(false);
    document.body.classList.add('custom-cursor-on');
    document.documentElement.style.cursor = 'none';

    let raf = 0;
    const tick = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.14);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.14);
      const el = largeRef.current;
      if (el) {
        el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (smallRef.current) {
        smallRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = el?.closest(
        'a, button, [role="button"], input, textarea, select, label, summary',
      );
      setHover(!!interactive);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.body.classList.remove('custom-cursor-on');
      document.documentElement.style.cursor = '';
    };
  }, []);

  if (disabled) return null;

  return (
    <>
      <div
        ref={smallRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-terracotta will-change-transform"
        style={{ transform: 'translate3d(0,0,0) translate(-50%, -50%)' }}
        aria-hidden
      />
      <div
        ref={largeRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-terracotta will-change-transform transition-[width,height,background-color] duration-200 ease-out"
        style={{
          width: hover ? 48 : 32,
          height: hover ? 48 : 32,
          backgroundColor: hover ? 'rgba(139, 58, 30, 0.2)' : 'transparent',
          opacity: hover ? 1 : 0.45,
          transform: 'translate3d(0,0,0) translate(-50%, -50%)',
        }}
        aria-hidden
      />
    </>
  );
}
