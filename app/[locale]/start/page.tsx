import { ProjectForm } from '@/components/contact/ProjectForm';
import { socialMetadata } from '@/lib/seo-metadata';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'project.start.meta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    ...socialMetadata(locale, title, description, '/start'),
  };
}

export default async function StartPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'project.start' });

  return (
    <div className="container py-12 md:py-16">
      <header className="mx-auto mb-10 max-w-[640px] text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent">
          {t('brandLine')}
        </p>
        <h1 className="mt-3 font-serif text-[clamp(28px,5vw,40px)] leading-tight text-[#3D1F10]">
          {t('heroTitle')}
        </h1>
        <p className="mx-auto mt-4 max-w-lg font-sans text-sm leading-relaxed text-[#6B4C35]">
          {t('heroSubtitle')}
        </p>
      </header>
      <ProjectForm />
    </div>
  );
}
