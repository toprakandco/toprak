'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return reduced;
}

type Props = {
  coverImage: string | null;
  images: string[];
  alt: string;
};

export function PortfolioGallery({ coverImage, images, alt }: Props) {
  const allImages = useMemo(() => {
    const out: string[] = [];
    if (coverImage) {
      out.push(coverImage);
    }
    for (const u of images) {
      if (u && u !== coverImage) {
        out.push(u);
      }
    }
    return out;
  }, [coverImage, images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [fade, setFade] = useState(1);
  const prefersReduced = usePrefersReducedMotion();

  const swap = useCallback(
    (index: number) => {
      if (index === activeIndex || index < 0 || index >= allImages.length) {
        return;
      }
      const delay = prefersReduced ? 0 : 200;
      setFade(0);
      window.setTimeout(() => {
        setActiveIndex(index);
        setFade(1);
      }, delay);
    },
    [activeIndex, allImages.length, prefersReduced],
  );

  useEffect(() => {
    if (activeIndex >= allImages.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, allImages.length]);

  if (allImages.length === 0) {
    return (
      <div className="flex min-h-[280px] w-full items-center justify-center rounded-2xl bg-beige">
        <svg
          className="h-24 w-24 text-leaf/30"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden
        >
          <path
            d="M12 48L28 20l10 16 8-8 16 20H12z"
            stroke="currentColor"
            strokeWidth={1.2}
          />
          <circle cx="24" cy="18" r="4" stroke="currentColor" strokeWidth={1.2} />
        </svg>
      </div>
    );
  }

  const mainSrc = allImages[activeIndex] ?? allImages[0];
  const showThumbs = allImages.length > 1;

  return (
    <div className="w-full">
      <div
        className="relative aspect-[16/10] max-h-[520px] w-full overflow-hidden rounded-2xl bg-beige"
        style={{
          opacity: fade,
          transition: prefersReduced ? 'none' : 'opacity 200ms ease-out',
        }}
      >
        <Image
          src={mainSrc}
          alt={alt}
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 1200px) 100vw, 1152px"
        />
      </div>

      {showThumbs ? (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {allImages.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => swap(i)}
              className={`relative block h-20 w-28 shrink-0 overflow-hidden rounded-lg ring-2 transition-shadow ${
                i === activeIndex
                  ? 'ring-terracotta'
                  : 'ring-transparent hover:ring-beige'
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="112px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
