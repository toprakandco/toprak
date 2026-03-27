'use client';

import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  line1: string[];
  line2: string[];
  overline: string;
  marquee: string;
};

export function BlogListingHeader({ line1, line2, overline, marquee }: Props) {
  const reduce = useReducedMotion();
  const line1Words = line1.flatMap((w) => w.split(/\s+/).filter(Boolean));
  const line2Words = line2.flatMap((w) => w.split(/\s+/).filter(Boolean));
  const lastLine1Count = line1Words.length;

  const item = reduce
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 40 },
        show: { opacity: 1, y: 0 },
      };

  return (
    <section
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden pb-10 pt-14 md:pb-14 md:pt-20"
      style={{ backgroundColor: '#F5F0E6' }}
    >
      <div
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-serif text-[clamp(4rem,22vw,14rem)] font-medium leading-none text-[#3D1F10]"
        style={{ opacity: 0.04 }}
        aria-hidden
      >
        BLOG
      </div>

      <div className="container relative z-[1]">
        <p
          className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8B3A1E]"
          style={{ letterSpacing: '0.22em' }}
        >
          {overline}
        </p>

        <h1
          className="mt-6 font-serif leading-[1.05] text-[#3D1F10]"
          style={{ fontSize: 'clamp(44px, 7vw, 88px)' }}
        >
          <motion.span
            className="block"
            initial="hidden"
            animate="show"
            transition={reduce ? { staggerChildren: 0 } : { staggerChildren: 0.09, delayChildren: 0.08 }}
          >
            {line1Words.map((word, i) => (
              <motion.span
                key={`l1-${word}-${i}`}
                variants={item}
                transition={{
                  duration: reduce ? 0 : 0.55,
                  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                }}
                className="inline-block pr-[0.2em]"
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
          <motion.span
            className="mt-1 block font-serif italic text-[#8B3A1E]"
            style={{ fontSize: 'clamp(44px, 7vw, 88px)' }}
            initial="hidden"
            animate="show"
            transition={
              reduce
                ? { staggerChildren: 0 }
                : { staggerChildren: 0.09, delayChildren: 0.08 + lastLine1Count * 0.09 }
            }
          >
            {line2Words.map((word, i) => (
              <motion.span
                key={`l2-${word}-${i}`}
                variants={item}
                transition={{
                  duration: reduce ? 0 : 0.55,
                  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                }}
                className="inline-block pr-[0.2em]"
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              className="blog-typewriter-cursor inline-block translate-y-[-0.05em] font-light text-[#8B3A1E] motion-reduce:animate-none"
              aria-hidden
            >
              |
            </motion.span>
          </motion.span>
        </h1>
      </div>

      <div
        className="relative z-[1] mt-10 w-full overflow-hidden border-y border-transparent py-2"
        style={{ background: 'none' }}
      >
        <div
          className={`blog-marquee-track flex w-max font-serif italic ${reduce ? '' : 'blog-marquee-30s'}`}
          style={{ color: 'rgba(139, 58, 30, 0.25)', fontSize: '18px' }}
        >
          <span className="shrink-0 whitespace-nowrap px-4">{marquee}</span>
          {!reduce ? <span className="shrink-0 whitespace-nowrap px-4">{marquee}</span> : null}
        </div>
      </div>
    </section>
  );
}
