import { socialMetadata } from '@/lib/seo-metadata';
import { SssRedirectClient } from './SssRedirectClient';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sss.meta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    ...socialMetadata(locale, title, description, '/sss'),
  };
}

export default async function SssPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SssRedirectClient />;
}
