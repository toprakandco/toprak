'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const STAGGER = 0.04;

export function AboutManifestoSection() {
  const t = useTranslations('about.manifesto');
  const reduce = useReducedMotion();
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const quoteInView = useInView(quoteRef, { once: true, amount: 0.35, margin: '0px 0px -8% 0px' });

  const line1 = t('line1');
  const line2 = t('line2');
  const words1 = line1.split(/\s+/).filter(Boolean);
  const words2 = line2.split(/\s+/).filter(Boolean);
  const allWords = [...words1, ...words2];

  const active = reduce || quoteInView;

  return (
    <section
      className="relative overflow-hidden bg-[#3D1F10] py-32"
      data-spotlight-dark
      aria-labelledby="about-manifesto-heading"
    >
      <h2 id="about-manifesto-heading" className="sr-only">
        {t('heading')}
      </h2>

      {/* Decorative quotation mark */}
      <svg
        className="pointer-events-none absolute -left-2 -top-8 select-none sm:left-0 sm:top-0"
        width={400}
        height={400}
        viewBox="0 0 400 400"
        aria-hidden
      >
        <text
          x={0}
          y={300}
          fill="#8B3A1E"
          fillOpacity={0.06}
          fontSize={400}
          fontFamily="'Playfair Display', Georgia, ui-serif, serif"
          fontStyle="italic"
        >
          &ldquo;
        </text>
      </svg>

      <div className="container relative z-[1] flex justify-center px-4">
        <blockquote className="mx-auto max-w-[800px] text-center">
          <p
            ref={quoteRef}
            className="font-serif italic leading-[1.35] text-[#F5F0E6]"
            style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}
          >
            <span className="block">
              {words1.map((word, i) => (
                <motion.span
                  key={`w1-${word}-${i}`}
                  className="inline-block pr-[0.28em]"
                  initial={false}
                  animate={
                    active
                      ? { opacity: 1, y: 0 }
                      : { opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }
                  }
                  transition={{
                    delay: reduce ? 0 : i * STAGGER,
                    duration: 0.45,
                    ease,
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="mt-[0.35em] block">
              {words2.map((word, i) => (
                <motion.span
                  key={`w2-${word}-${i}`}
                  className="inline-block pr-[0.28em]"
                  initial={false}
                  animate={
                    active
                      ? { opacity: 1, y: 0 }
                      : { opacity: reduce ? 1 : 0, y: reduce ? 0 : 20 }
                  }
                  transition={{
                    delay: reduce ? 0 : (words1.length + i) * STAGGER,
                    duration: 0.45,
                    ease,
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </p>

          <motion.div
            className="mx-auto mt-10 h-px w-[60px] bg-[#C4824A]"
            initial={false}
            animate={active ? { scaleX: 1 } : { scaleX: reduce ? 1 : 0 }}
            transition={{
              delay: reduce ? 0 : allWords.length * STAGGER + 0.15,
              duration: 0.5,
              ease,
            }}
            style={{ transformOrigin: 'center' }}
          />

          <motion.p
            className="mt-8 text-center text-[14px] text-[#F5F0E6]/50"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
            initial={false}
            animate={active ? { opacity: 1 } : { opacity: reduce ? 1 : 0 }}
            transition={{
              delay: reduce ? 0 : allWords.length * STAGGER + 0.28,
              duration: 0.5,
            }}
          >
            {t('attribution')}
          </motion.p>
        </blockquote>
      </div>
    </section>
  );
}
