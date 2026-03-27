'use client';

import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  overline: string;
  heading: string;
  subtitle: string;
  stats: { value: string; label: string }[];
};

export function PortfolioPageHeader({ overline, heading, subtitle, stats }: Props) {
  const reduce = useReducedMotion();
  const words = heading.split(' ');

  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden bg-cream py-20 text-center">
      <div className="container relative">
        <span className="pointer-events-none absolute inset-x-0 top-8 select-none font-serif text-[clamp(52px,12vw,170px)] text-[#3D1F10]/[0.04]">
          &amp; Co.
        </span>

        <p className="relative z-[1] text-[10px] tracking-[0.22em] text-terracotta">
          {overline}
        </p>

        <h1 className="relative z-[1] mt-4 font-serif text-[clamp(40px,6vw,72px)] leading-[1.06] text-[#3D1F10]">
          {words.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              className="mr-[0.25em] inline-block"
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : i * 0.08, ease: 'easeOut' }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <svg className="mx-auto mt-5 h-6 w-[130px]" viewBox="0 0 130 24" fill="none" aria-hidden>
          <path
            d="M2 15c18-10 30-10 45 0s27 10 42 0 26-10 39 0"
            stroke="#8B3A1E"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="[stroke-dasharray:190] [stroke-dashoffset:190] animate-[services-draw_1.2s_ease_0.15s_forwards]"
          />
        </svg>

        <p className="relative z-[1] mx-auto mt-6 max-w-[620px] text-[15px] text-[#6B4C35]/75">
          {subtitle}
        </p>

        <ul className="relative z-[1] mt-8 flex flex-wrap items-center justify-center gap-3 text-center">
          {stats.map((item, i) => (
            <li key={item.value} className="flex items-center gap-3">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-[26px] text-[#3D1F10]">{item.value}</span>
                {item.label ? <span className="text-[13px] text-[#6B4C35]">{item.label}</span> : null}
              </div>
              {i !== stats.length - 1 ? <span className="text-[#8B3A1E]/55">·</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
