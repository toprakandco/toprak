import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sss.meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function SssPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('sss');
  const items = t.raw('items') as { q: string; a: string }[];

  return (
    <div className="text-brown-deep">
      <header className="container max-w-3xl pt-4">
        <h1 className="font-serif text-4xl text-brown-deep md:text-5xl">{t('pageTitle')}</h1>
        <p className="mt-4 text-base leading-relaxed text-brown-deep/75">{t('intro')}</p>
      </header>

      <div className="container mt-12 max-w-3xl space-y-3 pb-16">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-xl border border-beige bg-white px-5 py-4 shadow-sm open:bg-cream/50"
          >
            <summary className="cursor-pointer list-none font-medium text-brown-deep marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                <span>{item.q}</span>
                <span className="mt-1 shrink-0 text-terracotta transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 border-t border-beige/80 pt-3 text-sm leading-relaxed text-brown-deep/80">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
