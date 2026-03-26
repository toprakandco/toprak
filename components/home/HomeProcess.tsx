'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

type Step = { title: string; desc: string };

type Props = {
  overline: string;
  heading: string;
  steps: Step[];
};

export function HomeProcess({ overline, heading, steps }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = useReducedMotion();

  return (
    <section
      ref={ref}
      className="relative left-1/2 w-[100dvw] max-w-[100dvw] -translate-x-1/2 bg-cream py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-[1280px] px-[max(24px,5vw)]">
        <p className="text-center text-xs font-medium uppercase tracking-[0.35em] text-terracotta">
          {overline}
        </p>
        <h2 className="mt-4 text-center font-serif text-[clamp(24px,4vw,48px)] text-brown-deep">{heading}</h2>

        <div className="relative mt-16 hidden md:block">
          <svg
            className="absolute left-0 right-0 top-[22px] h-2 w-full text-terracotta/35"
            viewBox="0 0 800 8"
            preserveAspectRatio="none"
            aria-hidden
          >
            <motion.path
              d="M4 4h792"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </svg>
          <div className="relative grid grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                className="flex flex-col items-center text-center"
                initial={reduce ? false : { scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 + i * 0.1 }}
              >
                <div className="relative z-[1] flex h-11 w-11 items-center justify-center rounded-full border-2 border-terracotta bg-cream text-sm font-semibold text-terracotta">
                  {i + 1}
                </div>
                <h3 className="mt-6 font-serif text-lg text-brown-deep">{step.title}</h3>
                <p className="mt-2 text-sm text-brown-deep/75">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <ol className="relative mt-12 space-y-10 md:hidden">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-terracotta bg-cream text-sm font-semibold text-terracotta">
                {i + 1}
              </div>
              <div>
                <h3 className="font-serif text-lg text-brown-deep">{step.title}</h3>
                <p className="mt-1 text-sm text-brown-deep/75">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
