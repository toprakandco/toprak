import { ContactForm } from '@/components/contact/ContactForm';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact.meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  return (
    <div className="container space-y-10 py-6 md:space-y-12">
      <header className="text-center">
        <h1 className="font-serif text-4xl text-terracotta md:text-5xl">
          {t('title')}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-brown-deep/65">{t('subtitle')}</p>
      </header>

      <Suspense
        fallback={
          <div className="mx-auto max-w-xl animate-pulse rounded-3xl border border-beige bg-beige/40 p-8 md:p-10" />
        }
      >
        <ContactForm />
      </Suspense>
    </div>
  );
}
