'use client';

import { useTranslations } from 'next-intl';

const KEYS = ['a', 'b', 'c'] as const;
const NUMS = ['01', '02', '03'];

export function AboutValuesHoverSection() {
  const t = useTranslations('about.values');

  return (
    <section className="bg-[#F5F0E6] py-24">
      <div className="container">
        <h2 className="text-center font-serif text-[clamp(1.75rem,4vw,2.75rem)] leading-tight text-[#3D1F10]">
          {t('title')}
        </h2>

        <ul className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {KEYS.map((key, i) => (
            <li key={key}>
              <article
                className="group relative flex min-h-[80px] flex-col overflow-hidden border-l-4 border-l-transparent bg-white pl-4 transition-[min-height,background-color,border-color] duration-[400ms] ease-out hover:min-h-[160px] hover:border-l-[#7A9E6E] hover:bg-[#F5F0E6] focus-within:min-h-[160px] focus-within:border-l-[#7A9E6E] focus-within:bg-[#F5F0E6] motion-reduce:transition-none"
                tabIndex={0}
              >
                <div className="flex flex-1 flex-col px-2 pb-5 pt-5">
                  <div className="flex items-start gap-3">
                    <span
                      className="shrink-0 font-serif text-4xl leading-none text-[#3D1F10]/20"
                      aria-hidden
                    >
                      {NUMS[i]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-[18px] leading-snug text-[#3D1F10]">
                        {t(`items.${key}.title`)}
                      </h3>
                      <p
                        className="mt-0 max-h-0 overflow-hidden text-sm leading-relaxed text-[#7A6050] opacity-0 transition-[max-height,opacity,margin] duration-[400ms] ease-out [font-family:var(--font-inter),system-ui,sans-serif] group-hover:mt-3 group-hover:max-h-[200px] group-hover:opacity-100 focus-within:mt-3 focus-within:max-h-[200px] focus-within:opacity-100 motion-reduce:transition-none"
                      >
                        {t(`items.${key}.desc`)}
                      </p>
                    </div>
                  </div>
                </div>

                <span
                  className="pointer-events-none absolute bottom-0 left-0 block h-[0.5px] w-full origin-left scale-x-0 bg-[#EDE4D3] transition-transform duration-[400ms] ease-out group-hover:scale-x-100 group-focus-within:scale-x-100 motion-reduce:scale-x-100 motion-reduce:transition-none"
                  aria-hidden
                />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
