'use client';

import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [reduced, setReduced] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateReduced = () => setReduced(mq.matches);
    updateReduced();
    mq.addEventListener('change', updateReduced);
    return () => mq.removeEventListener('change', updateReduced);
  }, []);

  useEffect(() => {
    if (reduced) {
      setProgress(0);
      return;
    }

    const onScroll = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      const next =
        scrollable > 0 ? Math.min(100, (el.scrollTop / scrollable) * 100) : 0;
      setProgress(next);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced]);

  if (reduced) {
    return null;
  }

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[200] h-[3px] bg-beige/40"
      aria-hidden
    >
      <div
        className="h-full bg-terracotta transition-[width] duration-100 ease-out motion-reduce:transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
