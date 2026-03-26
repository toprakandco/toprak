/** Organic roots / branches — two forms growing together. */
export function AboutRootsIllustration() {
  return (
    <svg
      viewBox="0 0 320 360"
      className="h-auto w-full max-w-md text-terracotta"
      fill="none"
      aria-hidden
    >
      <path
        d="M160 340V120M160 200c-40-30-70-70-85-120M160 180c35-25 60-60 75-105M95 195c-15 35-10 75 15 105M225 185c18 38 12 82-18 115"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.85}
      />
      <path
        d="M160 120c-8-25-5-52 8-75 18 8 30 28 32 52-12 12-28 18-40 23z"
        fill="var(--gold)"
        opacity={0.35}
      />
      <path
        d="M70 240c-12 22-8 48 10 68 22-8 38-28 45-50-18-14-38-20-55-18z"
        fill="var(--leaf)"
        opacity={0.28}
      />
      <path
        d="M250 255c10 20 8 45-8 62-20-6-35-22-42-42 16-12 34-18 50-20z"
        fill="var(--leaf)"
        opacity={0.22}
      />
      <path
        d="M120 80c-25-8-48 5-62 28 14 18 35 28 58 28 5-20 8-40 4-56z"
        stroke="var(--leaf)"
        strokeWidth={1.2}
        opacity={0.6}
      />
      <path
        d="M200 70c20-5 42 2 58 18-12 22-32 36-55 40-8-18-10-38-3-58z"
        stroke="var(--gold)"
        strokeWidth={1.2}
        opacity={0.55}
      />
      <circle cx="160" cy="95" r="6" fill="var(--terracotta)" opacity={0.4} />
      <circle cx="95" cy="265" r="5" fill="var(--terracotta)" opacity={0.35} />
      <circle cx="235" cy="278" r="5" fill="var(--gold)" opacity={0.45} />
    </svg>
  );
}
