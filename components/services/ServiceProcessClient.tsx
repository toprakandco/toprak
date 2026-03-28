'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

type Step = { title: string; desc: string };

type Props = {
  title: string;
  steps: Step[];
};

export function ServiceProcessClient({ title, steps }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = useReducedMotion();

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto w-full max-w-[1280px] px-[max(24px,5vw)]">
        <h2 className="text-center font-serif text-[clamp(24px,4vw,40px)] text-[#3D1F10]">
          {title}
        </h2>

        <div className="relative mt-12 hidden md:block">
          <svg
            className="absolute left-0 right-0 top-5 h-[10px] w-full text-accent/25"
            viewBox="0 0 1000 10"
            preserveAspectRatio="none"
            aria-hidden
          >
            <motion.path
              d="M4 5h992"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />
          </svg>

          <ol className="relative grid grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <li key={step.title} className="text-center">
                <motion.div
                  className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#8B3A1E] font-serif text-[17px] text-cream"
                  initial={reduce ? false : { scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: i * 0.1 }}
                >
                  {i + 1}
                </motion.div>
                <h3 className="mt-5 font-serif text-[16px] text-[#3D1F10]">{step.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#7A6050]">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>

        <ol className="mt-10 space-y-7 md:hidden">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-serif text-[17px] text-cream">
                {i + 1}
              </span>
              <div>
                <h3 className="font-serif text-[16px] text-[#3D1F10]">{step.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-[#7A6050]">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
