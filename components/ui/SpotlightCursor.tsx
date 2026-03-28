'use client';

import { useEffect, useState } from 'react';

const GRADIENT_LIGHT =
  'radial-gradient(circle at center, rgba(139,58,30,0.06) 0%, rgba(122,158,110,0.03) 40%, transparent 70%)';
const GRADIENT_DARK =
  'radial-gradient(circle at center, rgba(196,130,74,0.12) 0%, rgba(245,240,230,0.04) 40%, transparent 70%)';

const DARK_SECTION_SELECTOR = '[data-spotlight-dark]';

function pointInAnyVisibleDark(
  clientX: number,
  clientY: number,
  visible: ReadonlySet<Element>,
): boolean {
  for (const el of visible) {
    const r = el.getBoundingClientRect();
    if (
      clientX >= r.left &&
      clientX <= r.right &&
      clientY >= r.top &&
      clientY <= r.bottom
    ) {
      return true;
    }
  }
  return false;
}

export function SpotlightCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [onScreen, setOnScreen] = useState(false);
  const [dark, setDark] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)');
    if (reduce.matches || coarse.matches) return;

    setEnabled(true);

    const visibleDark = new Set<Element>();
    const observed = new WeakSet<Element>();
    let lastX = -1;
    let lastY = -1;

    const recomputeDark = () => {
      if (lastX < 0 || lastY < 0) return;
      setDark(pointInAnyVisibleDark(lastX, lastY, visibleDark));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleDark.add(entry.target);
          else visibleDark.delete(entry.target);
        });
        recomputeDark();
      },
      { threshold: 0, rootMargin: '0px' },
    );

    const scan = () => {
      document.querySelectorAll(DARK_SECTION_SELECTOR).forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          observer.observe(el);
        }
      });
    };

    scan();

    const mo = new MutationObserver(() => {
      scan();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      setPos({ x: e.clientX, y: e.clientY });
      setOnScreen(true);
      setDark(pointInAnyVisibleDark(e.clientX, e.clientY, visibleDark));
    };

    const onLeave = () => {
      setOnScreen(false);
      lastX = -1;
      lastY = -1;
    };

    const onScrollOrResize = () => recomputeDark();

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      observer.disconnect();
      mo.disconnect();
      visibleDark.clear();
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="spotlight-cursor pointer-events-none fixed z-[9999] h-[400px] w-[400px] rounded-full"
      style={{
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
        background: dark ? GRADIENT_DARK : GRADIENT_LIGHT,
        opacity: onScreen ? 1 : 0,
        transition: 'left 0.15s ease, top 0.15s ease',
      }}
    />
  );
}
