import { Link } from '@/i18n/navigation';
import { socialMetadata } from '@/lib/seo-metadata';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

type SectionBlock = {
  heading: string;
  body?: string;
  items?: string[];
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'kvkk.meta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    ...socialMetadata(locale, title, description, '/kvkk'),
  };
}

const SECTION_KEYS = [
  'controller',
  'collected',
  'purpose',
  'sharing',
  'retention',
  'rights',
  'cookies',
  'contact',
] as const;

export default async function KvkkPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('kvkk');

  return (
    <article className="bg-white pb-20 pt-8 text-[#3D1F10] md:pt-10">
      <div className="mx-auto w-full max-w-[800px] px-[max(24px,5vw)]">
        <nav className="mb-8 text-[13px] text-[#7A6050]" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-accent">
                {t('breadcrumbHome')}
              </Link>
            </li>
            <li aria-hidden>&gt;</li>
            <li className="text-[#3D1F10]">{t('title')}</li>
          </ol>
        </nav>

        <header className="mb-12 text-center">
          <h1 className="font-serif text-[clamp(26px,4vw,36px)] leading-tight text-[#3D1F10]">
            {t('title')}
          </h1>
        </header>

        <div
          className="space-y-10 font-sans text-[15px] leading-[1.9] text-[#3D1F10]/90"
          style={{ fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif' }}
        >
          {SECTION_KEYS.map((key) => {
            const data = t.raw(`sections.${key}`) as SectionBlock;
            return (
              <section key={key} aria-labelledby={`kvkk-${key}`}>
                <h2
                  id={`kvkk-${key}`}
                  className="mb-3 font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-accent"
                >
                  {data.heading}
                </h2>
                {data.items && data.items.length > 0 ? (
                  <ul className="list-disc space-y-2 pl-5 marker:text-accent">
                    {data.items.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : data.body ? (
                  <div className="whitespace-pre-line">{data.body}</div>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>
    </article>
  );
}
