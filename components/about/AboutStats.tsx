'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

const TARGETS = [5, 3, 10, 100] as const;
const SUFFIXES = ['+', '', '+', '+'] as const;
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

export function AboutStats() {
  const t = useTranslations('about.stats');
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);
  const [display, setDisplay] = useState(() => TARGETS.map(() => 0));
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setDisplay([...TARGETS]);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [prefersReduced]);

  useEffect(() => {
    if (!started || prefersReduced) return;

    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / DURATION_MS);
      const eased = easeOutCubic(t);
      setDisplay(TARGETS.map((target) => Math.round(target * eased)));
      if (t < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        setDisplay([...TARGETS]);
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [started, prefersReduced]);

  const labelKeys = ['web', 'books', 'social', 'projects'] as const;

  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-terracotta px-4 py-16 text-cream md:px-8 md:py-24"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-serif text-3xl text-cream md:text-4xl">
          {t('title')}
        </h2>
        <ul className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {TARGETS.map((_, i) => (
            <li key={labelKeys[i]} className="text-center">
              <p
                className="font-serif text-[2.75rem] leading-none text-gold md:text-[56px]"
                aria-live={prefersReduced ? undefined : 'polite'}
              >
                {display[i]}
                {SUFFIXES[i]}
              </p>
              <p className="mt-3 text-xs leading-snug text-cream/75 md:text-sm">
                {t(`labels.${labelKeys[i]}`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
