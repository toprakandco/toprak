import { AboutCtaSection } from '@/components/about/AboutCtaSection';
import { AboutRootsIllustration } from '@/components/about/AboutRootsIllustration';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

function HeaderBranch() {
  return (
    <svg
      className="pointer-events-none absolute right-2 top-1/2 h-56 w-40 max-w-[42%] -translate-y-1/2 text-leaf opacity-[0.1] sm:right-6 md:h-72 md:w-48"
      viewBox="0 0 140 220"
      fill="none"
      aria-hidden
    >
      <path
        d="M70 205V25M70 115c-32-22-55-52-62-88M70 100c28-18 48-48 58-82M70 140c-22-14-38-34-48-58M70 125c20-12 34-32 44-55"
        stroke="currentColor"
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      <path
        d="M28 95c-8 16-5 34 8 48 12-6 22-16 26-28-10-12-22-18-34-20z"
        fill="currentColor"
        opacity={0.4}
      />
      <path
        d="M102 58c-12 12-16 30-10 48 14 0 28-4 40-14-4-18-14-32-30-34z"
        fill="currentColor"
        opacity={0.32}
      />
    </svg>
  );
}

function ValueIcon({ variant }: { variant: 'sprout' | 'branches' | 'book' }) {
  const stroke = 'currentColor';
  const common = {
    fill: 'none' as const,
    stroke,
    strokeWidth: 1.35,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'mx-auto h-14 w-14 text-terracotta md:h-16 md:w-16',
  };

  if (variant === 'sprout') {
    return (
      <svg viewBox="0 0 64 64" {...common} aria-hidden>
        <path d="M32 52V28M32 28c-8-6-12-16-10-26 6 4 10 12 10 22M32 28c8-6 12-16 10-26-6 4-10 12-10 22" />
        <path d="M24 40c-4 6-2 12 4 14M40 40c4 6 2 12-4 14" />
        <path d="M32 52v6" />
      </svg>
    );
  }
  if (variant === 'branches') {
    return (
      <svg viewBox="0 0 64 64" {...common} aria-hidden>
        <path d="M32 8v20M32 28c-10-4-18-12-22-22M32 28c10-4 18-12 22-22" />
        <path d="M18 42c-6 8-4 18 6 22M46 42c6 8 4 18-6 22" />
        <path d="M32 48v14" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" {...common} aria-hidden>
      <path d="M14 18h36v36H14z" />
      <path d="M20 26h24M20 34h18M20 42h22" opacity={0.7} />
      <path d="M44 14c4 4 6 10 4 16" />
    </svg>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  const industries = t.raw('industries.list') as string[];
  const m1Skills = t.raw('team.member1.skills') as string[];
  const m2Skills = t.raw('team.member2.skills') as string[];

  return (
    <div className="text-brown-deep">
      <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-beige py-16 md:py-20">
        <HeaderBranch />
        <div className="container relative">
          <div className="max-w-3xl text-center md:text-left">
          <h1 className="font-serif text-4xl text-brown-deep md:text-5xl lg:text-6xl">
            {t('pageTitle')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-brown-deep/75 md:mx-0 md:text-lg">
            {t('pageSubtitle')}
          </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-serif text-2xl italic leading-snug text-terracotta md:text-3xl lg:text-[2rem]">
              {t('story.pullQuote')}
            </p>
            <p className="mt-8 text-base leading-relaxed text-brown-deep/90">
              {t('story.body')}
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md rounded-2xl border border-beige bg-beige/60 p-8 shadow-inner ring-1 ring-terracotta/10 md:p-10">
              <AboutRootsIllustration />
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container">
        <h2 className="text-center font-serif text-3xl text-brown-deep md:text-4xl">
          {t('team.title')}
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {[1, 2].map((n) => {
            const prefix = `team.member${n}` as const;
            return (
              <article
                key={n}
                className="flex flex-col rounded-2xl border border-beige border-t-[3px] border-t-transparent bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-t-terracotta hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div
                  className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-[3px] border-terracotta bg-beige text-terracotta"
                  aria-hidden
                >
                  <svg viewBox="0 0 48 48" className="h-14 w-14" fill="none">
                    <path
                      d="M24 40V18M24 26c-6-5-10-12-8-20 4 3 7 8 8 14M24 26c6-5 10-12 8-20-4 3-7 8-8 14"
                      stroke="currentColor"
                      strokeWidth={1.2}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-center font-serif text-xl text-brown-deep md:text-2xl">
                  {t(`${prefix}.name`)}
                </h3>
                <p className="mt-2 text-center text-sm font-medium text-terracotta">
                  {t(`${prefix}.role`)}
                </p>
                <p className="mt-4 text-center text-sm leading-relaxed text-brown-deep/80">
                  {t(`${prefix}.bio`)}
                </p>
                <ul className="mt-6 flex flex-wrap justify-center gap-2">
                  {(n === 1 ? m1Skills : m2Skills).map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-leaf/12 px-3 py-1 text-xs font-medium text-leaf-dark ring-1 ring-leaf/25"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
        </div>
      </section>

      <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-cream py-16 md:py-24">
        <div className="container">
          <h2 className="text-center font-serif text-3xl text-brown-deep md:text-4xl">
            {t('values.title')}
          </h2>
          <ul className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
            {(['a', 'b', 'c'] as const).map((key, i) => {
              const variants: Array<'sprout' | 'branches' | 'book'> = [
                'sprout',
                'branches',
                'book',
              ];
              return (
                <li
                  key={key}
                  className="flex flex-col items-center rounded-xl border border-beige/80 bg-beige/40 px-6 py-8 text-center shadow-sm"
                >
                  <ValueIcon variant={variants[i]} />
                  <h3 className="mt-6 font-serif text-xl text-brown-deep">
                    {t(`values.items.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-brown-deep/70">
                    {t(`values.items.${key}.desc`)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-white py-16 md:py-24">
        <div className="container">
          <h2 className="text-center font-serif text-3xl text-brown-deep md:text-4xl">
            {t('industries.title')}
          </h2>
          <ul className="mt-10 flex flex-wrap justify-center gap-3 md:mt-12">
            {industries.map((label) => (
              <li key={label}>
                <span className="inline-flex rounded-full bg-beige px-4 py-2 text-sm font-medium text-brown-deep transition-colors duration-200 hover:bg-terracotta hover:text-cream">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AboutCtaSection />
    </div>
  );
}
