'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

const DURATION_MS = 1800;

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

function HandDrawnLine({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 10"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 5 C40 2 80 8 120 5 S200 2 240 5 S320 8 400 5"
        stroke="#EDE4D3"
        strokeWidth={0.75}
        strokeLinecap="round"
      />
    </svg>
  );
}

type NumericStatProps = {
  target: number;
  showPlus: boolean;
  label: string;
  started: boolean;
  reduced: boolean;
};

function NumericStat({ target, showPlus, label, started, reduced }: NumericStatProps) {
  const [value, setValue] = useState(reduced ? target : 0);
  const [plusOn, setPlusOn] = useState(reduced && showPlus);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      if (showPlus) setPlusOn(true);
      return;
    }
    if (!started) return;

    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / DURATION_MS);
      const eased = easeOutCubic(t);
      const v = Math.round(target * eased);
      setValue(v);
      if (t >= 1) {
        setValue(target);
        if (showPlus) {
          setPlusOn(true);
        }
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [started, target, reduced, showPlus]);

  return (
    <div className="flex flex-col items-center text-center">
      <p
        className="flex items-baseline justify-center font-serif leading-none text-[#8B3A1E]"
        style={{ fontSize: 'clamp(52px, 7vw, 88px)' }}
        aria-live={reduced ? undefined : 'polite'}
      >
        <span>{value}</span>
        {showPlus && plusOn ? (
          <motion.span
            className="inline-block font-serif"
            style={{ fontSize: 'clamp(52px, 7vw, 88px)' }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            +
          </motion.span>
        ) : null}
      </p>
      <p
        className="mt-3 max-w-[12rem] text-[13px] leading-snug text-[#7A6050]"
        style={{
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </p>
    </div>
  );
}

function InfinityStat({ label, reduced }: { label: string; reduced: boolean }) {
  return (
    <div className="flex flex-col items-center text-center">
      <p
        className={`font-serif leading-none text-[#8B3A1E] ${reduced ? '' : 'about-stat-infinity-pulse'}`}
        style={{ fontSize: 'clamp(52px, 7vw, 88px)' }}
        aria-hidden
      >
        ∞
      </p>
      <p
        className="mt-3 max-w-[12rem] text-[13px] leading-snug text-[#7A6050]"
        style={{
          fontFamily: 'var(--font-inter), system-ui, sans-serif',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </p>
    </div>
  );
}

export function AboutStatsSection() {
  const t = useTranslations('about.stats');
  const sectionRef = useRef<HTMLElement>(null);
  const [started, setStarted] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setStarted(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="bg-white py-20">
      <div className="container">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0">
          <NumericStat
            target={100}
            showPlus
            label={t('labels.projects')}
            started={started}
            reduced={reduced}
          />
          <NumericStat
            target={6}
            showPlus={false}
            label={t('labels.services')}
            started={started}
            reduced={reduced}
          />

          <div className="col-span-2 py-2 lg:hidden">
            <HandDrawnLine className="h-2 w-full" />
          </div>

          <NumericStat
            target={3}
            showPlus={false}
            label={t('labels.books')}
            started={started}
            reduced={reduced}
          />
          <InfinityStat label={t('labels.creativity')} reduced={reduced} />
        </div>
      </div>
    </section>
  );
}
