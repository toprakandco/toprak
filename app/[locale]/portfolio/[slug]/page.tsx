import { PortfolioGallery } from '@/components/portfolio/PortfolioGallery';
import { PortfolioCard } from '@/components/portfolio/PortfolioCard';
import { CtaBanner } from '@/components/shared/CtaBanner';
import { Link } from '@/i18n/navigation';
import { isServiceSlug } from '@/lib/service-slugs';
import { SEED_PORTFOLIO_SLUGS } from '@/lib/seed-portfolio';
import {
  getActivePortfolioSlugs,
  getPortfolioItemBySlugSafe,
  getRelatedPortfolioItemsSafe,
} from '@/lib/supabase';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const fromDb = await getActivePortfolioSlugs();
  const slugs =
    fromDb.length > 0 ? fromDb : (SEED_PORTFOLIO_SLUGS as readonly string[]).slice();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getPortfolioItemBySlugSafe(slug);
  const t = await getTranslations({ locale, namespace: 'portfolio.meta' });

  if (!item) {
    return { title: t('title') };
  }

  const title = locale === 'tr' ? item.title_tr : item.title_en;
  const description =
    (locale === 'tr' ? item.description_tr : item.description_en) ?? t('description');

  return {
    title: `${title} | Toprak & Co.`,
    description: description.slice(0, 180),
  };
}

export default async function PortfolioDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const item = await getPortfolioItemBySlugSafe(slug);

  if (!item) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations('portfolio.detail');
  const tPf = await getTranslations('portfolio');

  const title = locale === 'tr' ? item.title_tr : item.title_en;
  const description =
    (locale === 'tr' ? item.description_tr : item.description_en) ?? '';

  const categorySlug = item.category;
  const categoryLabel =
    categorySlug && isServiceSlug(categorySlug)
      ? tPf(`filters.categories.${categorySlug}` as never)
      : tPf('filters.uncategorized');

  const related = await getRelatedPortfolioItemsSafe(
    item.category,
    item.slug,
    3,
  );

  const serviceHref =
    categorySlug && isServiceSlug(categorySlug)
      ? `/services/${categorySlug}`
      : null;

  return (
    <article className="text-brown-deep">
      <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-cream px-4 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <nav
            className="text-sm text-brown-deep/55"
            aria-label="Breadcrumb"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-terracotta">
                  {t('breadcrumbHome')}
                </Link>
              </li>
              <li aria-hidden className="text-brown-deep/35">
                /
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="transition hover:text-terracotta"
                >
                  {t('breadcrumbPortfolio')}
                </Link>
              </li>
              <li aria-hidden className="text-brown-deep/35">
                /
              </li>
              <li className="font-medium text-brown-deep/80">{title}</li>
            </ol>
          </nav>

          <h1 className="mt-8 font-serif text-4xl text-brown-deep md:text-5xl lg:text-[3rem]">
            {title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full bg-leaf/15 px-4 py-1.5 text-sm font-medium text-leaf-dark ring-1 ring-leaf/25">
              {categoryLabel}
            </span>
            {item.tags?.length ? (
              <ul className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-beige px-3 py-1 text-xs font-medium text-brown-deep"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mx-auto mt-10 max-w-6xl md:mt-14">
        <PortfolioGallery
          coverImage={item.cover_image}
          images={item.images ?? []}
          alt={title}
        />
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-10 md:mt-16 md:grid-cols-3 md:gap-12">
        <div className="md:col-span-2">
          <h2 className="font-serif text-2xl text-brown-deep">
            {t('descriptionHeading')}
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brown-deep/80">
            {description.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-beige bg-white p-6 shadow-sm md:sticky md:top-28">
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-brown-deep/50">
                {t('categoryLabel')}
              </dt>
              <dd className="mt-1 font-medium text-brown-deep">{categoryLabel}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-brown-deep/50">
                {t('serviceLabel')}
              </dt>
              <dd className="mt-1">
                {serviceHref ? (
                  <Link
                    href={serviceHref}
                    className="font-medium text-terracotta underline-offset-4 hover:underline"
                  >
                    {categoryLabel}
                  </Link>
                ) : (
                  <span className="text-brown-deep/70">—</span>
                )}
              </dd>
            </div>
            {item.tags?.length ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-brown-deep/50">
                  {t('tagsLabel')}
                </dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-beige px-2.5 py-1 text-xs text-brown-deep"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            ) : null}
          </dl>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="mx-auto mt-20 max-w-6xl md:mt-28">
          <h2 className="font-serif text-3xl text-brown-deep md:text-4xl">
            {t('relatedTitle')}
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {related.map((rel) => (
              <PortfolioCard
                key={rel.id}
                item={rel}
                locale={locale}
                categoryLabel={
                  rel.category && isServiceSlug(rel.category)
                    ? tPf(`filters.categories.${rel.category}` as never)
                    : tPf('filters.uncategorized')
                }
                ctaLabel={tPf('card.cta')}
              />
            ))}
          </div>
        </section>
      ) : null}

      <div className="relative left-1/2 mt-20 w-screen max-w-[100vw] -translate-x-1/2 md:mt-28">
        <CtaBanner />
      </div>
    </article>
  );
}
