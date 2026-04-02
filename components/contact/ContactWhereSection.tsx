import { getTranslations } from 'next-intl/server';

/** Türkiye ana kara + Trakya konturları (world.geo.json / Natural Earth tarzı sınır, equirectangular ölçek). */
const TURKEY_MAP_PATH =
  'M 114.13 20.86 L 128.48 27.79 L 140.13 25.03 L 148.73 26.62 L 160.54 17.27 L 171.2 16.42 L 180.83 25.22 L 182.53 31.52 L 181.56 40.23 L 189.0 44.69 L 192.94 49.92 L 186.09 55.02 L 189.21 75.56 L 187.26 81.11 L 192.73 95.45 L 187.93 98.48 L 184.42 93.92 L 172.79 91.61 L 168.5 94.39 L 157.12 97.18 L 151.73 96.87 L 140.23 103.59 L 132.0 103.65 L 126.68 100.28 L 115.67 105.26 L 112.39 101.78 L 111.85 111.77 L 109.18 115.69 L 106.5 119.61 L 102.82 111.49 L 106.61 104.77 L 100.51 106.29 L 92.15 102.17 L 85.27 112.48 L 70.09 114.49 L 62.0 104.88 L 51.22 104.28 L 48.91 111.71 L 42.0 113.83 L 32.33 104.3 L 21.41 104.62 L 15.49 86.81 L 8.18 76.87 L 13.05 62.94 L 6.71 54.38 L 17.8 37.25 L 33.2 36.54 L 37.4 22.93 L 56.46 25.3 L 68.48 13.68 L 80.13 8.62 L 96.68 8.23 L 114.13 20.86 Z M 16.92 32.41 L 8.58 42.05 L 5.43 33.71 L 5.57 30.02 L 7.95 28.01 L 11.04 16.8 L 6.17 12.06 L 16.36 6.42 L 24.97 8.82 L 26.16 15.71 L 34.88 21.49 L 33.06 25.88 L 21.19 26.87 L 16.92 32.41 Z';

function TurkeyMapIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[280px]" aria-hidden>
      <svg
        viewBox="0 0 200 120"
        className="h-auto w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d={TURKEY_MAP_PATH}
          className="fill-[#EDE4D3]/55 stroke-[#C4B8A0]"
          strokeWidth={0.9}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <div
        className="pointer-events-none absolute left-[17%] top-[22%] flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
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
