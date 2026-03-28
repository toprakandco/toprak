import { getTranslations } from 'next-intl/server';

function TurkeyMapIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[280px]" aria-hidden>
      <svg
        viewBox="0 0 200 120"
        className="h-auto w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M38 28c8-6 22-8 34-5l14 4 8-2 12 6 6 14-2 10 8 4 10-2 18 8 4 12-6 18-14 10-22 6-28 2-24-4-32-14-10-18-6-22 2-28 10-6z"
          stroke="#EDE4D3"
          strokeWidth="1.35"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M44 32c6-4 16-5 24-2"
          stroke="#EDE4D3"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      <div
        className="pointer-events-none absolute left-[26%] top-[21%] flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        aria-hidden
      >
        <span className="absolute inline-flex h-6 w-6 rounded-full border border-accent/50 animate-contact-where-ripple" />
        <span className="absolute inline-flex h-6 w-6 rounded-full border border-accent/40 animate-contact-where-ripple-delayed" />
        <span className="relative z-[1] h-[8px] w-[8px] rounded-full bg-accent" />
      </div>
    </div>
  );
}

export async function ContactWhereSection() {
  const t = await getTranslations('contact.where');
  const features = ['remote', 'video', 'inPerson'] as const;

  return (
    <section
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-white py-16"
      aria-labelledby="contact-where-heading"
    >
      <div className="mx-auto w-full max-w-[720px] px-[max(24px,5vw)]">
        <h2
          id="contact-where-heading"
          className="text-center font-serif text-[clamp(1.35rem,3.5vw,1.75rem)] text-[#3D1F10]"
        >
          {t('title')}
        </h2>

        <div className="mt-10 rounded-[20px] bg-[#F5F0E6] p-6 md:flex md:items-center md:gap-10 md:p-10">
          <div className="flex shrink-0 justify-center md:w-[42%]">
            <TurkeyMapIllustration />
          </div>
          <div className="mt-8 md:mt-0 md:flex-1">
            <p className="font-serif text-xl text-[#3D1F10] md:text-[22px]">
              {t('line1')}
            </p>
            <p className="mt-3 font-sans text-[15px] leading-relaxed text-[#6B4C35]">
              {t('line2')}
            </p>
            <p className="mt-1 font-sans text-[15px] leading-relaxed text-[#6B4C35]">
              {t('line3')}
            </p>
            <ul className="mt-6 space-y-3">
              {features.map((key) => (
                <li
                  key={key}
                  className="flex items-start gap-3 font-sans text-[15px] text-[#3D1F10]"
                >
                  <span className="shrink-0 text-lg leading-none" aria-hidden>
                    {t(`features.${key}.icon`)}
                  </span>
                  <span>{t(`features.${key}.text`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
