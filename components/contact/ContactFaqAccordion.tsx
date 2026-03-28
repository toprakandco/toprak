'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function ContactFaqAccordion() {
  const t = useTranslations('contact.faqAccordion');
  const items = t.raw('items') as { q: string; a: string }[];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="sss"
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 scroll-mt-[calc(var(--navbar-height)+16px)] bg-[#F5F0E6] py-20"
      aria-labelledby="contact-faq-heading"
    >
      <div className="mx-auto w-full max-w-[720px] px-[max(24px,5vw)]">
        <h2
          id="contact-faq-heading"
          className="text-center font-serif text-[clamp(1.5rem,4vw,2rem)] text-[#3D1F10]"
        >
          {t('title')}
        </h2>

        <ul className="mt-10 list-none space-y-3 p-0">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={i}>
                <div
                  className={`overflow-hidden rounded-xl border border-[#EDE4D3]/80 border-l-[3px] transition-[background-color,border-color] duration-300 ${
                    isOpen
                      ? 'border-l-[#7A9E6E] bg-[#FDFAF8]'
                      : 'border-l-transparent bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left outline-none ring-accent focus-visible:ring-2"
                  >
                    <span className="font-sans text-[15px] font-medium leading-snug text-[#3D1F10]">
                      {item.q}
                    </span>
                    <span
                      className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center font-sans text-xl leading-none text-accent transition-transform duration-300 ease-out ${
                        isOpen ? 'rotate-45' : 'rotate-0'
                      }`}
                      aria-hidden
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="px-5 pb-4 pl-5 font-sans text-[14px] leading-relaxed text-[#6B4C35]">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
