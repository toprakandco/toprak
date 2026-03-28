import { AboutCtaSection } from '@/components/about/AboutCtaSection';
import { AboutHeroSection } from '@/components/about/AboutHeroSection';
import { AboutIndustriesSection } from '@/components/about/AboutIndustriesSection';
import { AboutManifestoSection } from '@/components/about/AboutManifestoSection';
import { AboutRootsIllustration } from '@/components/about/AboutRootsIllustration';
import { AboutStatsSection } from '@/components/about/AboutStatsSection';
import { AboutTeamSection } from '@/components/about/AboutTeamSection';
import { AboutValuesHoverSection } from '@/components/about/AboutValuesHoverSection';
import { socialMetadata } from '@/lib/seo-metadata';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about.meta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    ...socialMetadata(locale, title, description, '/about'),
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
      <AboutHeroSection />

      <AboutManifestoSection />

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

      <AboutTeamSection member1Skills={m1Skills} member2Skills={m2Skills} />

      <AboutStatsSection />

      <AboutValuesHoverSection />

      <AboutIndustriesSection labels={industries} />

      <AboutCtaSection />
    </div>
  );
}
