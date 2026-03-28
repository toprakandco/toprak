'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from '@/i18n/navigation';
import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';

type SweepPhase = 'idle' | 'in' | 'out';

const ease = [0.25, 0.1, 0.25, 1] as const;

const contentVariants = {
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
  /** Under the sweep; instant so the incoming route is not visible until the overlay passes. */
  hold: {
    opacity: 0,
    y: 16,
    transition: { duration: 0 },
  },
} as const;

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const skipSweepRef = useRef(true);
  const [sweep, setSweep] = useState<SweepPhase>('idle');
  const [contentPhase, setContentPhase] = useState<'enter' | 'hold'>('enter');

  useLayoutEffect(() => {
    if (skipSweepRef.current) {
      skipSweepRef.current = false;
      return;
    }
    setContentPhase('hold');
    setSweep('in');
  }, [pathname]);

  const onSweepAnimationComplete = () => {
    if (sweep === 'in') {
      setSweep('out');
      return;
    }
    if (sweep === 'out') {
      setSweep('idle');
      setContentPhase('enter');
    }
  };

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[48] bg-accent"
        initial={false}
        animate={
          sweep === 'idle'
            ? { scaleX: 0, opacity: 0 }
            : sweep === 'in'
              ? { scaleX: 1, opacity: 1 }
              : { scaleX: 0, opacity: 1 }
        }
        style={{
          transformOrigin: sweep === 'out' ? 'right' : 'left',
        }}
        transition={{ duration: 0.3, ease }}
        onAnimationComplete={onSweepAnimationComplete}
      />

      <AnimatePresence initial={false}>
        <motion.div
          key="page-transition-shell"
          variants={contentVariants}
          initial={false}
          animate={contentPhase === 'enter' ? 'enter' : 'hold'}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
