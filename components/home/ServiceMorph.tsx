'use client';

import { useRouter } from '@/i18n/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type ServiceMorphItem = {
  label: string;
  description: string;
  slug: string;
};

type Props = {
  overline: string;
  prefix: string;
  suffix: string;
  items: ServiceMorphItem[];
};

export function ServiceMorph({ overline, prefix, suffix, items }: Props) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [pausedUntil, setPausedUntil] = useState(0);
  const resumeRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduce || Date.now() < pausedUntil) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, [items.length, pausedUntil, reduce]);

  useEffect(() => {
    return () => {
      if (resumeRef.current) window.clearTimeout(resumeRef.current);
    };
  }, []);

  const onPillClick = (idx: number) => {
    setIndex(idx);
    setPausedUntil(Date.now() + 4000);
    if (resumeRef.current) window.clearTimeout(resumeRef.current);
    resumeRef.current = window.setTimeout(() => setPausedUntil(0), 4000);
  };

  const active = items[index];

  return (
    <section className="relative left-1/2 w-[100dvw] max-w-[100dvw] -translate-x-1/2 bg-cream px-4 py-24 md:px-6">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-terracotta">
          {overline}
        </p>

        <div className="mt-6 flex flex-wrap items-end justify-center gap-x-4 gap-y-2">
          <span className="font-serif text-[40px] text-brown-deep md:text-[52px]">{prefix}</span>
          <span className="relative inline-flex min-h-[76px] min-w-[180px] items-center justify-center md:min-h-[88px] md:min-w-[220px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={`word-${active.label}`}
                className="font-serif text-[52px] italic text-terracotta md:text-[68px]"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? {} : { opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {active.label}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="font-serif text-[40px] text-brown-deep md:text-[52px]">{suffix}</span>
        </div>

        <div className="mx-auto mt-5 min-h-[48px] max-w-3xl text-[15px] text-[#6B4C35]">
          <AnimatePresence mode="wait">
            <motion.p
              key={`desc-${active.label}`}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? {} : { opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              {active.description}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {items.map((item, idx) => {
            const isActive = idx === index;
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() => onPillClick(idx)}
                onDoubleClick={() => router.push(`/services/${item.slug}`)}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-terracotta text-cream'
                    : 'bg-beige text-[#6B4C35] hover:bg-terracotta/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

