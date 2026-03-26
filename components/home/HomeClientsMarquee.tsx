'use client';

type Props = {
  title: string;
  items: string[];
  separator: string;
};

export function HomeClientsMarquee({ title, items, separator }: Props) {
  const renderRow = (rowItems: string[]) =>
    rowItems.map((item, i) => (
      <span key={`${item}-${i}`} className="inline-flex items-center gap-2">
        <span className="rounded-full border border-brown-deep/15 bg-cream/70 px-3 py-1 text-[11px] font-medium normal-case tracking-normal text-brown-deep/85 shadow-[0_1px_6px_rgba(61,31,16,0.08)]">
          {item}
        </span>
        <span className={i % 2 === 0 ? 'text-[#C4824A]' : 'text-[#7A9E6E]'}>{separator}</span>
      </span>
    ));
  const row = [...items, ...items];

  return (
    <section className="relative left-1/2 w-[100dvw] max-w-[100dvw] -translate-x-1/2 bg-beige py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-center font-serif text-2xl text-brown-deep md:text-3xl">{title}</h2>
      </div>
      <div className="mt-10 overflow-hidden">
        <div className="home-clients-marquee-row flex w-max gap-4 whitespace-nowrap px-4 text-brown-deep/80 hover:[animation-play-state:paused] md:gap-5">
          {renderRow(row)}
          <span aria-hidden className="inline-flex items-center gap-2">
            {renderRow(row)}
          </span>
        </div>
      </div>
    </section>
  );
}
