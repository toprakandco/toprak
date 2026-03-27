'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Props = {
  src: string;
  alt: string;
};

export function ArticleCoverParallax({ src, alt }: Props) {
  const [offset, setOffset] = useState(0);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const setM = () => setDesktop(mq.matches);
    setM();
    mq.addEventListener('change', setM);
    return () => mq.removeEventListener('change', setM);
  }, []);

  useEffect(() => {
    if (!desktop) {
      setOffset(0);
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const onScroll = () => {
      setOffset(window.scrollY * 0.3);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [desktop]);

  return (
    <div className="relative left-1/2 mt-10 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden rounded-2xl px-4 md:mt-12 md:px-8">
      <div className="relative mx-auto max-h-[520px] overflow-hidden rounded-2xl">
        <div
          className="will-change-transform"
          style={{
            transform: desktop
              ? `translate3d(0, ${offset}px, 0)`
              : 'translate3d(0,0,0)',
            WebkitTransform: desktop
              ? `translate3d(0, ${offset}px, 0)`
              : 'translate3d(0,0,0)',
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={1600}
            height={900}
            priority
            className="max-h-[520px] w-full object-cover"
            sizes="(max-width: 1200px) 100vw, 1152px"
          />
        </div>
      </div>
    </div>
  );
}
