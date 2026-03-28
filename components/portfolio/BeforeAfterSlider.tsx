'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type BeforeAfterSliderProps = {
  beforeImage: string;
  afterImage: string;
  title: string;
  className?: string;
  /** 0–100, default 50 */
  initialPosition?: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  title,
  className = '',
  initialPosition = 50,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [pos, setPos] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const p = clamp((x / rect.width) * 100, 0, 100);
    setPos(p);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      setFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
      setDragging(false);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [setFromClientX]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    draggingRef.current = true;
    setDragging(true);
    setFromClientX(e.clientX);
  };

  const clipRight = `${100 - pos}%`;

  return (
    <div
      ref={containerRef}
      data-ba-slider
      className={`relative isolate touch-none overflow-hidden rounded-2xl bg-beige ${className}`}
      style={{ cursor: 'ew-resize', touchAction: 'none' }}
      onPointerDown={onPointerDown}
      role="img"
      aria-label={title}
    >
      {/* Before (full, bottom layer) */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover select-none"
          draggable={false}
        />
      </div>

      {/* After (top layer, clipped from the right so left pos% shows) */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${clipRight} 0 0)`,
          transition: dragging ? 'none' : 'clip-path 0.3s ease',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover select-none"
          draggable={false}
        />
      </div>

      {/* Sonra: top-right of after (left) side; Önce: top-left of before (right) side */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-1/2"
        aria-hidden
      >
        <span className="absolute right-3 top-3 rounded-[20px] border border-[#3D1F10]/10 bg-white px-3 py-1 font-sans text-[11px] font-medium text-[#3D1F10]">
          Sonra
        </span>
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-1/2"
        aria-hidden
      >
        <span className="absolute left-3 top-3 rounded-[20px] border border-[#3D1F10]/10 bg-white px-3 py-1 font-sans text-[11px] font-medium text-[#3D1F10]">
          Önce
        </span>
      </div>

      {/* Divider + handle */}
      <div
        className="pointer-events-none absolute inset-y-0 z-[3] w-[2px] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
        style={{
          left: `${pos}%`,
          transform: 'translateX(-50%)',
          transition: dragging ? 'none' : 'left 0.3s ease',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 z-[4] flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md"
        style={{
          left: `${pos}%`,
          transition: dragging ? 'none' : 'left 0.3s ease',
        }}
        aria-hidden
      >
        <svg
          width="22"
          height="14"
          viewBox="0 0 22 14"
          fill="none"
          className="text-[#3D1F10]"
          aria-hidden
        >
          <path
            d="M6 2L2 7l4 5M16 2l4 5-4 5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
