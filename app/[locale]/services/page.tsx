import { ServicesBottomCta } from '@/components/services/ServicesBottomCta';
import { ServicesGridClient } from '@/components/services/ServicesGridClient';
import { SERVICE_SLUGS } from '@/lib/service-slugs';
import { getServices } from '@/lib/supabase';
import type { Service } from '@/types';
import { socialMetadata } from '@/lib/seo-metadata';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services.meta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    ...socialMetadata(locale, title, description, '/services'),
  };
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('services');
  const tEn = await getTranslations({ locale: 'en', namespace: 'services' });

  let services: Service[] = [];
  try {
    services = await getServices();
  } catch {
    services = [];
  }

  const normalized: Service[] =
    services.length > 0
      ? services
      : SERVICE_SLUGS.map((slug, i) => ({
          id: `fallback-${slug}`,
          created_at: '',
          slug,
          title_tr: t(`slugs.${slug}.title`),
          title_en: tEn(`slugs.${slug}.title`),
          description_tr: t(`slugs.${slug}.description`),
          description_en: tEn(`slugs.${slug}.description`),
          icon: null,
          tags: (t.raw(`slugs.${slug}.tags`) as string[]) ?? [],
          order_index: i + 1,
          is_active: true,
        }));

  return (
    <div className="text-[#3D1F10]">
      <section className="bg-cream py-20 text-center">
        <div className="container">
          <div className="mx-auto w-full max-w-[980px]">
          <p className="animate-[fadeInUp_0.6s_ease_forwards] text-[10px] tracking-[0.22em] text-terracotta">
            {t('overline')}
          </p>
          <h1 className="mt-4 font-serif text-[clamp(30px,6vw,44px)] leading-[1.15] text-[#3D1F10]">
            <span className="block">{t('headingLine1')}</span>
            <span className="mt-1 block italic text-terracotta">{t('headingLine2')}</span>
          </h1>

          <svg
            className="mx-auto mt-4 h-6 w-[120px]"
            viewBox="0 0 120 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M2 14c16-10 26-10 40 0s24 10 38 0 24-10 38 0"
              stroke="#8B3A1E"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="[stroke-dasharray:180] [stroke-dashoffset:180] animate-[services-draw_1.2s_ease_0.2s_forwards]"
            />
          </svg>

          <p className="mx-auto mt-6 max-w-[500px] text-[15px] leading-relaxed text-[#6B4C35]/75">
            {t('subtitle')}
          </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container">
          <ServicesGridClient
            services={normalized}
            locale={locale}
            detailLabel={t('ctaDetails')}
          />
        </div>
      </section>

      <ServicesBottomCta
        title={t('bottomCta.title')}
        subtitle={t('bottomCta.subtitle')}
        button={t('bottomCta.button')}
        buttonStart={t('bottomCta.buttonStart')}
      />
    </div>
  );
}
