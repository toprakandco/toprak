import { ServiceProcessClient } from '@/components/services/ServiceProcessClient';
import { VoiceOverSelector } from '@/components/services/VoiceOverSelector';
import { ServiceSignatureIcon } from '@/components/services/ServiceSignatureIcon';
import { ServicesBottomCta } from '@/components/services/ServicesBottomCta';
import { Link } from '@/i18n/navigation';
import { socialMetadata } from '@/lib/seo-metadata';
import { SERVICE_SLUGS, isServiceSlug } from '@/lib/service-slugs';
import {
  getActiveServiceSlugs,
  getPortfolioItems,
  getServiceBySlug,
} from '@/lib/supabase';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { PortfolioItem } from '@/types';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  let fromDb: string[] = [];
  try {
    fromDb = await getActiveServiceSlugs();
  } catch {
    fromDb = [];
  }
  const slugs = fromDb.length > 0 ? fromDb : [...SERVICE_SLUGS];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'services.meta' });

  const fallbackTitle = t('title');
  const fallbackDesc = t('description');

  try {
    const service = await getServiceBySlug(slug);
    if (!service) {
      return {
        title: fallbackTitle,
        description: fallbackDesc,
        ...socialMetadata(locale, fallbackTitle, fallbackDesc, `/services/${slug}`),
      };
    }
    const pageTitle = `${locale === 'tr' ? service.title_tr : service.title_en} | Toprak & Co.`;
    const description =
      (locale === 'tr' ? service.description_tr : service.description_en) ??
      fallbackDesc;
    return {
      title: pageTitle,
      description,
      ...socialMetadata(locale, pageTitle, description, `/services/${slug}`),
    };
  } catch {
    return {
      title: fallbackTitle,
      description: fallbackDesc,
      ...socialMetadata(locale, fallbackTitle, fallbackDesc, `/services/${slug}`),
    };
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isServiceSlug(slug)) notFound();

  let service = null;
  try {
    service = await getServiceBySlug(slug);
  } catch {
    service = null;
  }
  if (!service) notFound();

  setRequestLocale(locale);
  const t = await getTranslations('services.detail');
  const tServices = await getTranslations('services');

  const title = locale === 'tr' ? service.title_tr : service.title_en;
  const description =
    (locale === 'tr' ? service.description_tr : service.description_en) ?? '';
  const tags = service.tags ?? [];
  const order = String(service.order_index || 1).padStart(2, '0');

  const processSteps = ['1', '2', '3', '4'].map((k) => ({
    title: t(`processSteps.${k}.title`),
    desc: t(`processSteps.${k}.desc`),
  }));

  let portfolioItems: PortfolioItem[] = [];
  try {
    portfolioItems = await getPortfolioItems(slug, 3);
  } catch {
    portfolioItems = [];
  }

  return (
    <article className="text-[#3D1F10]">
      <section className="relative bg-cream py-16 md:py-20">
        <span className="pointer-events-none absolute right-[max(24px,5vw)] top-8 font-serif text-[90px] text-[#8B3A1E]/[0.05] md:text-[160px]">
          {order}
        </span>

        <div className="container">
          <nav className="text-[13px] text-[#7A6050]" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-accent">
                  {t('breadcrumbHome')}
                </Link>
              </li>
              <li aria-hidden>&gt;</li>
              <li>
                <Link href="/services" className="transition hover:text-accent">
                  {t('breadcrumbServices')}
                </Link>
              </li>
              <li aria-hidden>&gt;</li>
              <li className="text-[#3D1F10]">{title}</li>
            </ol>
          </nav>

          <div className="mt-8 flex h-[88px] w-[88px] items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#EAF3DE,#F5F0E6)]">
            <ServiceSignatureIcon slug={slug} className="h-12 w-12" />
          </div>

          <h1 className="mt-6 max-w-4xl font-serif text-[clamp(36px,5vw,56px)] leading-tight text-[#3D1F10]">
            {title}
          </h1>

          {tags.length > 0 ? (
            <div className="mt-5 flex flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="m-[3px_2px] rounded-[20px] border border-[#EDE4D3] bg-[#F5F0E6] px-3 py-1 text-[11px] text-[#7A6050]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <p className="mt-6 max-w-[640px] text-[16px] leading-[1.9] text-[#6B4C35]">
            {description}
          </p>

          <Link
            href={`/contact?subject=${encodeURIComponent(slug)}`}
            className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full bg-terracotta px-7 py-3 text-sm font-semibold text-cream transition hover:bg-[#6B2C14]"
          >
            {t('ctaQuote')}
          </Link>
        </div>
      </section>

      {slug === 'seslendirme' ? <VoiceOverSelector /> : null}

      <ServiceProcessClient title={t('processTitle')} steps={processSteps} />

      <section className="bg-[#fff] py-20">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-serif text-[clamp(24px,4vw,38px)] text-[#3D1F10]">
              {t('portfolioTitle')}
            </h2>
            <Link
              href={`/portfolio?category=${encodeURIComponent(slug)}`}
              className="inline-flex min-h-[44px] items-center text-sm text-accent transition hover:translate-x-1"
            >
              {t('portfolioSeeAll')}
            </Link>
          </div>

          {portfolioItems.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-[#EDE4D3] bg-[#FAF7F1] p-10 text-center">
              <svg
                className="mx-auto h-14 w-14 text-[#7A9E6E]/70"
                viewBox="0 0 64 64"
                fill="none"
                aria-hidden
              >
                <path
                  d="M32 56V16M32 28c-8-5-12-13-11-22 6 2 10 8 11 16M32 30c8-5 12-13 11-22-6 2-10 8-11 16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <p className="mt-4 text-[14px] text-[#7A6050]">{t('portfolioEmpty')}</p>
            </div>
          ) : (
            <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {portfolioItems.map((item) => {
                const itemTitle = locale === 'tr' ? item.title_tr : item.title_en;
                return (
                  <li key={item.id}>
                    <Link
                      href={`/portfolio/${item.slug}`}
                      className="block overflow-hidden rounded-2xl border border-[#EDE4D3] bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition hover:-translate-y-1"
                    >
                      <div className="relative aspect-[4/3] bg-[#F5F0E6]">
                        {item.cover_image ? (
                          <Image
                            src={item.cover_image}
                            alt={itemTitle}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ServiceSignatureIcon slug={slug} className="h-10 w-10" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif text-[20px] text-[#3D1F10]">{itemTitle}</h3>
                        <span className="mt-3 inline-flex rounded-full border border-[#EDE4D3] bg-[#F5F0E6] px-3 py-1 text-[11px] text-[#7A6050]">
                          {tServices(`slugs.${slug}.title`)}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <ServicesBottomCta
        title={tServices('bottomCta.title')}
        subtitle={tServices('bottomCta.subtitle')}
        button={tServices('bottomCta.button')}
      />
    </article>
  );
}
