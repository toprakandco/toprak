'use client';

import { Link } from '@/i18n/navigation';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

type Props = {
  lines: string[];
  body: string;
  cta: string;
};

function RootsIllustration({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 360 400" className="h-auto w-full max-w-md text-terracotta" fill="none" aria-hidden>
      <motion.path
        d="M120 360c-20-80-10-160 40-220M120 360c30-50 80-90 140-100M120 200c40-30 90-40 140-30M180 80c-10-25 5-50 25-65"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={1.4}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
      <motion.path
        d="M240 360c15-70 5-150-35-210M240 360c-35-45-90-75-150-80M240 200c-45-25-95-30-145-15M200 70c20-22 50-30 80-10"
        stroke="#7A9E6E"
        strokeOpacity={0.4}
        strokeWidth={1.3}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 2, delay: 0.15, ease: 'easeInOut' }}
      />
      <motion.path
        d="M180 360c0-60 0-120 0-180M180 180c0-25 0-50 0-75"
        stroke="currentColor"
        strokeOpacity={0.35}
        strokeWidth={1.2}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={active ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.1, delay: 0.2, ease: 'easeInOut' }}
      />
      <circle cx="180" cy="95" r="6" fill="var(--gold)" opacity={0.35} />
    </svg>
  );
}

export function HomeManifesto({ lines, body, cta }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-12% 0px' });
  const reduce = useReducedMotion();

  return (
    <section
      ref={ref}
      className="relative left-1/2 w-[100dvw] max-w-[100dvw] -translate-x-1/2 bg-beige py-20 md:py-28"
    >
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-[max(24px,5vw)] lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <blockquote className="font-serif text-3xl italic leading-snug text-brown-deep md:text-[40px]">
            {lines.map((line, i) => (
              <motion.span
                key={line}
                className="block"
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 * i, duration: 0.5 }}
              >
                {line}
              </motion.span>
            ))}
          </blockquote>
          <div
            className="mt-8 space-y-4 text-base leading-relaxed text-brown-deep/80"
          >
            {body.split('\n\n').map((para, i) => (
              <motion.p
                key={i}
                initial={reduce ? false : { opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.45 + i * 0.08, duration: 0.5 }}
              >
                {para}
              </motion.p>
            ))}
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.65, duration: 0.4 }}
            className="mt-8"
          >
            <Link
              href="/about"
              className="inline-flex text-sm font-medium text-terracotta underline-offset-4 transition hover:underline"
            >
              {cta}
            </Link>
          </motion.div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <RootsIllustration active={inView || !!reduce} />
        </div>
      </div>
    </section>
  );
}
