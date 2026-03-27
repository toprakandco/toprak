'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const [fade, setFade] = useState(1);
  const prefersReduced = useReducedMotion();

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

  useEffect(() => {
    if (prefersReduced) return;
    const onScroll = () => setParallaxY(window.scrollY * 0.4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [prefersReduced]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        setActiveIndex((i) => (i + 1) % allImages.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((i) => (i - 1 + allImages.length) % allImages.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, allImages.length]);

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
        className="relative aspect-[16/10] max-h-[560px] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-beige"
        style={{
          opacity: fade,
          transition: prefersReduced ? 'none' : 'opacity 200ms ease-out',
        }}
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={mainSrc}
          alt={alt}
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 1200px) 100vw, 1152px"
          style={{
            transform: prefersReduced ? 'none' : `translate3d(0, ${parallaxY}px, 0)`,
            transition: prefersReduced ? 'none' : 'transform 120ms linear',
          }}
        />
      </div>

      {showThumbs ? (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {allImages.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => swap(i)}
              className={`relative block h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition-shadow ${
                i === activeIndex
                  ? 'border-terracotta'
                  : 'border-transparent hover:border-beige'
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

      <AnimatePresence>
        {lightboxOpen ? (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-4"
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? {} : { opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-6 top-6 z-[91] inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white"
              aria-label="Close"
            >
              ×
            </button>

            {allImages.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((i) => (i - 1 + allImages.length) % allImages.length);
                  }}
                  className="absolute left-4 z-[91] inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white"
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex((i) => (i + 1) % allImages.length);
                  }}
                  className="absolute right-4 z-[91] inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white"
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            ) : null}

            <motion.div
              className="relative h-[90vh] w-[90vw]"
              initial={prefersReduced ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReduced ? {} : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={mainSrc} alt={alt} fill className="object-contain" sizes="90vw" />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
