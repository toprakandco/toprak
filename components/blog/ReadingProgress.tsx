'use client';

import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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
  }, []);

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-[3px] bg-[#F5F0E6]/50"
      aria-hidden
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-[#8B3A1E] via-[#C4824A] to-[#7A9E6E]"
        style={{
          width: `${progress}%`,
          transition: 'none',
          WebkitTransition: 'none',
        }}
      />
    </div>
  );
}
