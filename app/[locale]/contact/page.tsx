import { CallbackWidget } from '@/components/contact/CallbackWidget';
import { ContactFaqAccordion } from '@/components/contact/ContactFaqAccordion';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactHeroSection } from '@/components/contact/ContactHeroSection';
import { ContactWhereSection } from '@/components/contact/ContactWhereSection';
import { socialMetadata } from '@/lib/seo-metadata';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact.meta' });
  const title = t('title');
  const description = t('description');
  return {
    title,
    description,
    ...socialMetadata(locale, title, description, '/contact'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <ContactHeroSection />

      <div className="container space-y-10 py-12 md:space-y-14">
        <Suspense
          fallback={
            <div className="mx-auto max-w-[720px] animate-pulse rounded-[24px] border border-beige bg-beige/40 p-12 shadow-[0_8px_48px_rgba(0,0,0,0.06)]" />
          }
        >
          <ContactForm />
        </Suspense>

        <CallbackWidget />
      </div>

      <ContactFaqAccordion />
      <ContactWhereSection />
    </>
  );
}
