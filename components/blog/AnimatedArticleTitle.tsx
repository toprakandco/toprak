'use client';

import { motion, useReducedMotion } from 'framer-motion';

type Props = {
  title: string;
};

export function AnimatedArticleTitle({ title }: Props) {
  const reduce = useReducedMotion();
  const words = title.split(/\s+/).filter(Boolean);

  return (
    <h1
      className="mt-6 font-serif leading-[1.12] text-[#3D1F10]"
      style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block pr-[0.25em]"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{
            delay: reduce ? 0 : i * 0.05,
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}
