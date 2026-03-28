'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

type Props = {
  labels: string[];
};

export function AboutIndustriesSection({ labels }: Props) {
  const t = useTranslations('about.industries');
  const reduce = useReducedMotion();
  const [delays, setDelays] = useState<number[]>([]);

  useEffect(() => {
    if (reduce) {
      setDelays(labels.map(() => 0));
      return;
    }
    setDelays(labels.map(() => Math.random() * 0.5));
  }, [labels, reduce]);

  return (
    <section className="bg-[#3D1F10] py-20" data-spotlight-dark>
      <div className="container">
        <h2 className="text-center font-serif leading-snug text-[#F5F0E6] text-[clamp(1.35rem,3vw,2rem)]">
          {t('sectionHeading')}
        </h2>

        <ul className="mt-10 flex flex-wrap justify-center gap-3 md:mt-12">
          {labels.map((label, i) => (
            <motion.li
              key={label}
              {...(reduce
                ? { initial: { opacity: 1, y: 0 } }
                : {
                    initial: { opacity: 0, y: 16 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.2 },
                  })}
              transition={{
                delay: delays.length ? delays[i]! : i * 0.06,
                duration: reduce ? 0 : 0.45,
                ease,
              }}
            >
              <motion.span
                className="inline-flex cursor-default rounded-full border border-[#F5F0E6] bg-transparent px-4 py-2.5 text-sm font-medium text-[#F5F0E6] transition-colors duration-200 hover:bg-[#8B3A1E] hover:text-[#F5F0E6]"
                whileHover={reduce ? undefined : { scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              >
                {label}
              </motion.span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
