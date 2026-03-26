'use client';

import { useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  maxPx?: number;
};

export function Magnetic({ children, className = '', maxPx = 6 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) * 0.12;
    const dy = (e.clientY - cy) * 0.12;
    setT({
      x: Math.max(-maxPx, Math.min(maxPx, dx)),
      y: Math.max(-maxPx, Math.min(maxPx, dy)),
    });
  };

  const onLeave = () => setT({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transform: `translate3d(${t.x}px, ${t.y}px, 0)` }}
    >
      {children}
    </div>
  );
}
