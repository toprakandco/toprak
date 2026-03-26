'use client';

import { Link } from '@/i18n/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Magnetic } from '@/components/home/Magnetic';

type HeroLine = {
  words: string[];
  italic?: boolean;
  emphasis?: boolean;
};

type Props = {
  label: string;
  lines: HeroLine[];
  subtext: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scrollHint: string;
};

function HeroBranchSvg({ scrollY }: { scrollY: number }) {
  const reduce = useReducedMotion();
  const parallaxY = reduce ? 0 : -scrollY * 0.3;

  return (
    <motion.svg
      className="pointer-events-none absolute right-0 top-1/2 w-[40vw] min-w-[280px] max-w-[520px] text-terracotta"
      style={{ transform: `translateY(calc(-50% + ${parallaxY}px))` }}
      viewBox="0 0 400 520"
      fill="none"
      aria-hidden
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.path
        d="M320 480V180c0-40-25-75-60-95M320 200c35-20 55-55 65-95M320 220c-45-15-85-45-105-85M200 120c-30-35-70-55-115-55M180 200c-25 30-35 70-25 110M260 340c20 35 15 80-15 110"
        stroke="#8B3A1E"
        strokeOpacity={0.15}
        strokeWidth={2}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: 'easeInOut' }}
      />
      <motion.path
        d="M280 160c15-25 40-42 70-48M140 180c-20 25-25 58-10 88M300 360c25 15 45 40 55 70"
        stroke="#7A9E6E"
        strokeOpacity={0.12}
        strokeWidth={1.4}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, delay: 0.2, ease: 'easeInOut' }}
      />
      <motion.path
        d="M340 100c8 12 6 28-6 38M100 240c-12 18-8 42 10 56M360 400c10 18 5 40-12 52"
        stroke="#7A9E6E"
        strokeOpacity={0.12}
        strokeWidth={1.2}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.2, delay: 0.35, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}

function HeroSideBranch() {
  const reduce = useReducedMotion();

  return (
    <svg
      className="pointer-events-none absolute right-0 top-0 z-[1] h-full w-[200px] text-terracotta"
      viewBox="0 0 200 900"
      fill="none"
      aria-hidden
    >
      <motion.path
        d="M110 20V860M110 140c20-18 34-45 38-78M110 220c-22-16-34-44-36-76M110 340c26-14 44-40 52-72M110 470c-24-14-40-38-46-66M110 620c22-10 42-30 50-56M110 740c-18-10-34-28-42-50"
        stroke="#8B3A1E"
        strokeOpacity={0.22}
        strokeWidth={1.4}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.7, ease: 'easeInOut' }}
      />
      <motion.path
        d="M128 152c20-6 38-20 50-38M86 238c-18-8-34-22-44-40M136 354c20-4 38-16 52-32M78 488c-16-6-30-18-40-34M134 628c16-4 30-14 42-26M86 750c-14-6-26-16-34-28"
        stroke="#7A9E6E"
        strokeOpacity={0.2}
        strokeWidth={1.2}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, delay: 0.15, ease: 'easeInOut' }}
      />
      <motion.path
        d="M122 526c14-4 28-12 38-22M96 404c-12-5-22-13-30-24M120 786c10-3 20-9 28-16"
        stroke="#C4824A"
        strokeOpacity={0.18}
        strokeWidth={1.1}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 0.25, ease: 'easeInOut' }}
      />
    </svg>
  );
}

function FloatingLeaf({
  className,
  delay,
  duration,
}: {
  className: string;
  delay: string;
  duration: string;
}) {
  return (
    <svg
      viewBox="0 0 32 40"
      className={`pointer-events-none absolute text-leaf opacity-[0.08] ${className}`}
      style={{ animationDelay: delay, animationDuration: duration }}
      aria-hidden
    >
      <path
        d="M16 4c-6 8-10 18-8 28 4-2 8-8 10-16 2 10 0 20-6 26 8-4 14-14 16-24-2-6-6-11-12-14z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HomeHero({ label, lines, subtext, ctaPrimary, ctaSecondary, scrollHint }: Props) {
  const reduce = useReducedMotion();
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduce]);

  return (
    <section className="relative left-1/2 w-[100dvw] max-w-[100dvw] -translate-x-1/2 overflow-hidden bg-cream">
      <div className="pointer-events-none absolute inset-0">
        <HeroBranchSvg scrollY={scrollY} />
        <FloatingLeaf className="home-float-leaf left-[8%] top-[18%] h-8 w-6" delay="0s" duration="3.2s" />
        <FloatingLeaf className="home-float-leaf left-[22%] top-[62%] h-10 w-8" delay="0.4s" duration="5.5s" />
        <FloatingLeaf className="home-float-leaf right-[35%] top-[12%] h-7 w-5" delay="0.8s" duration="4.1s" />
        <FloatingLeaf className="home-float-leaf right-[12%] top-[48%] h-9 w-7" delay="1.2s" duration="6.8s" />
        <FloatingLeaf className="home-float-leaf left-[40%] top-[78%] h-6 w-5" delay="1.6s" duration="3.7s" />
        <FloatingLeaf className="home-float-leaf right-[48%] top-[70%] h-8 w-6" delay="2s" duration="7s" />
      </div>
      <HeroSideBranch />
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          overflow: 'hidden',
          zIndex: 0,
        }}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5 }}
        aria-hidden
      >
        <span
          style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 700,
            fontSize: 'clamp(80px, 14vw, 180px)',
            color: '#8B3A1E',
            opacity: 0.05,
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
          }}
        >
          TOPRAK
        </span>
      </motion.div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1280px] flex-col justify-center px-[max(24px,5vw)] pb-[max(60px,8vh)] pt-[max(80px,12vh)]">
        <motion.p
          className="font-serif text-lg italic text-terracotta md:text-xl"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {label}
        </motion.p>

        <div className="mt-8 max-w-4xl">
          {lines.map((line, lineIdx) => {
            const wordBase = lines
              .slice(0, lineIdx)
              .reduce((sum, l) => sum + l.words.length, 0);
            return (
              <div
                key={lineIdx}
                className={`flex flex-wrap gap-x-3 gap-y-1 font-serif text-brown-deep ${
                  line.emphasis ? 'text-[clamp(36px,7vw,68px)]' : 'text-[clamp(32px,6vw,64px)]'
                }`}
              >
                {line.words.map((word, wIdx) => {
                  const idx = wordBase + wIdx;
                  return (
                    <motion.span
                      key={`${lineIdx}-${wIdx}-${word}`}
                      className={`inline-block ${line.italic ? 'italic text-terracotta' : ''}`}
                      initial={reduce ? false : { opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.4 + idx * 0.12,
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </div>
            );
          })}
        </div>

        <motion.p
          className="mt-10 max-w-xl text-[clamp(14px,2vw,16px)] leading-relaxed text-brown-deep/70"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          {subtext}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <Magnetic>
            <Link
              href="/services"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-terracotta px-8 py-3 text-sm font-medium text-cream shadow-sm transition hover:bg-terracotta-dark"
            >
              {ctaPrimary}
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/portfolio"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-terracotta bg-transparent px-8 py-3 text-sm font-medium text-terracotta transition hover:bg-terracotta/10"
            >
              {ctaSecondary}
            </Link>
          </Magnetic>
        </motion.div>

        <motion.div
          className="mt-16 flex flex-col items-center gap-3 self-start md:mt-24"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <div className="relative h-14 w-px overflow-hidden bg-terracotta/25">
            <div className="home-scroll-line-dot absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-terracotta" />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-brown-deep/45">
            {scrollHint}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
