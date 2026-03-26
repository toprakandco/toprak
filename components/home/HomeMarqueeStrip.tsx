'use client';

type Props = {
  row1: string[];
};

function buildMarquee(items: string[]) {
  return items.map((item, i) => (
    <span key={`${item}-${i}`} className="inline-flex items-center gap-3">
      <span>{item}</span>
      <span className={i % 2 === 0 ? 'text-[#C4824A]' : 'text-[#7A9E6E]'}>✦</span>
    </span>
  ));
}

export function HomeMarqueeStrip({ row1 }: Props) {
  const a = [...row1, ...row1];

  return (
    <section className="relative left-1/2 w-[100dvw] max-w-[100dvw] -translate-x-1/2 overflow-hidden bg-[#3D1F10] py-[14px]">
      <div
        className="group flex flex-col gap-[6px]"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        <div className="home-marquee-new-row-1 flex w-max gap-4 whitespace-nowrap text-[11px] uppercase tracking-[0.15em] text-[rgba(245,240,230,0.75)] group-hover:[animation-play-state:paused]">
          {buildMarquee(a)}
          <span aria-hidden className="inline-flex items-center gap-3">
            {buildMarquee(a)}
          </span>
        </div>
      </div>
    </section>
  );
}
