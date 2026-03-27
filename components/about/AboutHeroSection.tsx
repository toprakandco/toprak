'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function EntwinedBranchesIllustration() {
  const reduce = useReducedMotion();

  return (
    <svg
      className="h-auto w-[min(100%,340px)] opacity-[0.85]"
      viewBox="0 0 340 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {/* Left branch — terracotta */}
      <motion.path
        d="M 42 400 C 52 320 38 260 78 200 C 108 155 125 130 155 118 C 168 112 172 105 170 98"
        stroke="#8B3A1E"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          pathLength: { duration: reduce ? 0 : 2.5, ease: 'easeInOut' },
        }}
      />
      {/* Right branch — leaf */}
      <motion.path
        d="M 298 400 C 288 310 302 250 262 195 C 232 155 215 132 185 118 C 175 113 172 106 170 98"
        stroke="#7A9E6E"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          pathLength: { duration: reduce ? 0 : 2.5, delay: reduce ? 0 : 0.12, ease: 'easeInOut' },
        }}
      />
      {/* Secondary intertwine accents */}
      <motion.path
        d="M 95 310 Q 130 270 155 240 Q 175 215 168 188"
        stroke="#8B3A1E"
        strokeWidth={1.15}
        strokeLinecap="round"
        opacity={0.45}
        fill="none"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          pathLength: { duration: reduce ? 0 : 2.2, delay: reduce ? 0 : 0.35, ease: 'easeInOut' },
        }}
      />
      <motion.path
        d="M 245 305 Q 210 265 185 238 Q 168 218 172 192"
        stroke="#7A9E6E"
        strokeWidth={1.15}
        strokeLinecap="round"
        opacity={0.45}
        fill="none"
        initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          pathLength: { duration: reduce ? 0 : 2.2, delay: reduce ? 0 : 0.45, ease: 'easeInOut' },
        }}
      />
      <motion.circle
        cx={170}
        cy={98}
        r={7}
        fill="#C4824A"
        initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: reduce ? 0 : 1.85,
          duration: reduce ? 0 : 0.45,
          ease,
        }}
      />
    </svg>
  );
}

export function AboutHeroSection() {
  const t = useTranslations('about.hero');
  const tAbout = useTranslations('about');
  const reduce = useReducedMotion();

  const lineDelays = reduce ? [0, 0, 0] : [0.4, 0.52, 0.64];
  const heroLines = [t('line1'), t('line2'), t('line3')].filter((line) => line.trim());
  const accentLine = t('line2');

  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#F5F0E6]"
      aria-labelledby="about-hero-heading"
    >
      {/* Background "& Co." */}
      <div
        className="pointer-events-none absolute -bottom-[60px] -right-10 select-none font-serif font-medium leading-none text-[#8B3A1E]"
        style={{
          opacity: 0.04,
          fontSize: 'clamp(120px, 18vw, 220px)',
        }}
        aria-hidden
      >
        &amp; Co.
      </div>

      {/* Decorative circles */}
      <div
        className="pointer-events-none absolute -left-[100px] top-[6%] h-[300px] w-[300px] rounded-full border border-[rgba(139,58,30,0.08)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[4%] top-1/2 h-[120px] w-[120px] -translate-y-1/2 rounded-full border border-[rgba(122,158,110,0.1)]"
        aria-hidden
      />

      <div className="relative z-[1] grid flex-1 grid-cols-1 items-center gap-10 px-6 py-24 lg:grid-cols-2 lg:gap-12 lg:py-0 lg:pl-[10vw] lg:pr-12">
        <div className="relative mx-auto w-full max-w-[600px] lg:mx-0">
          <h1 id="about-hero-heading" className="sr-only">
            {tAbout('pageTitle')}
          </h1>
          {/* Year — top right of content block */}
          <motion.span
            className="pointer-events-none absolute -right-1 top-0 z-0 hidden font-medium text-[#8B3A1E] sm:block md:right-0"
            style={{
              fontFamily: 'var(--font-playfair), ui-serif, Georgia, serif',
              fontSize: 'clamp(80px, 12vw, 140px)',
              lineHeight: 0.85,
            }}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 0.12, y: 0 }}
            transition={{ delay: reduce ? 0 : 0.3, duration: 0.7, ease }}
            aria-hidden
          >
            {t('year')}
          </motion.span>

          <motion.p
            className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8B3A1E]"
            style={{ letterSpacing: '0.22em' }}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : 0.2, duration: 0.6, ease }}
          >
            {t('overline')}
          </motion.p>

          <div className="relative z-[1] mt-8" aria-hidden>
            {heroLines.map((line, i) => (
              <motion.p
                key={`${line}-${i}`}
                className={`font-serif leading-[1.08] text-[#3D1F10] ${
                  line === accentLine ? 'italic text-[#8B3A1E]' : ''
                }`}
                style={{ fontSize: 'clamp(48px, 7vw, 88px)' }}
                initial={reduce ? false : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: lineDelays[i] ?? 0.4,
                  duration: 0.65,
                  ease,
                }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          <motion.div
            className="mt-8 h-0.5 max-w-[200px] origin-left"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: reduce ? 0 : 0.9, duration: 0.85, ease }}
            style={{
              width: 200,
              height: 2,
              background:
                'linear-gradient(90deg, #8B3A1E 0%, #C4824A 42%, #7A9E6E 72%, transparent 100%)',
            }}
          />

          <motion.p
            className="mt-8 max-w-[480px] text-base leading-[1.9] text-[#6B4C35]"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : 1, duration: 0.7, ease }}
          >
            {t('intro')}
          </motion.p>
        </div>

        <div className="hidden justify-center lg:flex lg:items-center">
          <EntwinedBranchesIllustration />
        </div>
      </div>

      <motion.div
        className="relative z-[2] flex flex-col items-center gap-3 pb-10 pt-4"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduce ? 0 : 1.2, duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-2" aria-hidden>
          <span className="about-hero-scroll-line block h-12 w-px bg-gradient-to-b from-[#8B3A1E]/50 to-transparent" />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#8B3A1E]/70">
          {t('scrollHint')}
        </span>
      </motion.div>

    </section>
  );
}
