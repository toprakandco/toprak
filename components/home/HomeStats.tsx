'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

const TARGETS = [10, 100] as const;
const SUFFIXES = ['+', '+'] as const;
const DURATION_MS = 1500;

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fn = () => setReduced(mq.matches);
    fn();
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return reduced;
}

export function HomeStats() {
  const t = useTranslations('home.stats');
  const sectionRef = useRef<HTMLElement>(null);
  const displayRef = useRef<number[]>([...TARGETS]);
  const [trigger, setTrigger] = useState(0);
  const [display, setDisplay] = useState(() => TARGETS.map(() => 0));
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  useEffect(() => {
    if (prefersReduced) {
      setDisplay([...TARGETS]);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTrigger((v) => v + 1);
      },
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [prefersReduced]);

  useEffect(() => {
    if (!trigger || prefersReduced) return;

    const start = performance.now();
    let raf = 0;
    let settleStart: number[] | null = null;

    const frame = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / DURATION_MS);

      if (p < 0.72) {
        // Flicker random values before settling to real totals.
        setDisplay([
          Math.floor(Math.random() * 35),
          Math.floor(Math.random() * 180),
        ]);
      } else {
        if (!settleStart) settleStart = [...displayRef.current];
        const local = (p - 0.72) / 0.28;
        const eased = easeOutCubic(Math.min(1, local));
        setDisplay(
          TARGETS.map((target, i) =>
            Math.round(settleStart![i] + (target - settleStart![i]) * eased),
          ),
        );
      }

      if (p < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        setDisplay([...TARGETS]);
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [trigger, prefersReduced]);

  const labelKeys = ['social', 'projects'] as const;
  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 w-[100dvw] max-w-[100dvw] -translate-x-1/2 overflow-hidden bg-terracotta py-7 text-cream"
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-cream opacity-[0.05]"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="home-topo" width="120" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M0 60 Q30 20 60 60 T120 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            />
            <path
              d="M0 90 Q40 50 80 90 T160 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#home-topo)" />
      </svg>

      <div className="relative mx-auto w-full max-w-[1280px] px-[max(24px,5vw)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
          <h2 className="font-serif text-lg text-cream md:text-xl">{t('title')}</h2>
          <ul className="flex flex-wrap items-center gap-2 md:gap-3">
          {TARGETS.map((_, i) => (
            <li
              key={labelKeys[i]}
              className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/[0.1] px-3 py-1.5"
            >
              <p
                className="font-serif text-lg leading-none text-gold md:text-xl"
                aria-live={prefersReduced ? undefined : 'polite'}
              >
                {display[i]}
                {SUFFIXES[i]}
              </p>
              <p className="text-[11px] leading-snug text-cream/85">
                {t(`labels.${labelKeys[i]}`)}
              </p>
            </li>
          ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
