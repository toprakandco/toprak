'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Küçük fidan — topraktan yeni çıkmış. Gövde + iki yaprak + toprak çizgisi.
 */
export function Seedling404Svg() {
  const reduce = useReducedMotion();

  return (
    <motion.svg
      width={220}
      height={220}
      viewBox="0 0 220 220"
      fill="none"
      aria-hidden
      className="shrink-0"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* Toprak — yatay büyür */}
      <motion.path
        d="M 40 178 H 180"
        stroke="#8B3A1E"
        strokeWidth={2}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Gövde — yukarı */}
      <motion.path
        d="M 110 178 V 88"
        stroke="#7A9E6E"
        strokeWidth={1.75}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.85, delay: 0.12, ease: [0.33, 1, 0.68, 1] }}
      />
      {/* Sol yaprak — soluk */}
      <motion.path
        d="M 110 96 C 98 88 86 92 82 102 C 88 98 100 94 110 96"
        fill="#7A9E6E"
        fillOpacity={0.22}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.72, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Sağ yaprak — soluk */}
      <motion.path
        d="M 110 96 C 122 88 134 92 138 102 C 132 98 120 94 110 96"
        fill="#7A9E6E"
        fillOpacity={0.22}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.svg>
  );
}
