import { SssRedirectClient } from './SssRedirectClient';
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
  return <SssRedirectClient />;
}
