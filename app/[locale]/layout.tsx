import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { PublicMaintenanceView } from '@/components/maintenance/PublicMaintenanceView';
import { PageTransition } from '@/components/ui/PageTransition';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { SpotlightCursor } from '@/components/ui/SpotlightCursor';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { routing } from '@/i18n/routing';
import { getSiteSettingsMapSafe } from '@/lib/site-settings';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Inter, Playfair_Display } from 'next/font/google';
import { notFound } from 'next/navigation';
import { SITE_URL, socialMetadata } from '@/lib/seo-metadata';
import type { Metadata, Viewport } from 'next';
import '../globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const title = t('title');
  const description = t('description');

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        tr: `${SITE_URL}/tr`,
        en: `${SITE_URL}/en`,
        'x-default': `${SITE_URL}/tr`,
      },
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
    ...socialMetadata(locale, title, description, ''),
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const settingsMap = await getSiteSettingsMapSafe();
  if (settingsMap.get('maintenance_mode') === 'true') {
    const settings = Object.fromEntries(settingsMap);
    return (
      <html lang={locale} dir="ltr" data-locale={locale} suppressHydrationWarning>
        <body
          className={`${inter.variable} ${playfair.variable} flex min-h-dvh flex-col bg-cream font-sans text-brown-deep antialiased`}
        >
          <SpotlightCursor />
          <CustomCursor />
          <PublicMaintenanceView locale={locale} settings={settings} />
        </body>
      </html>
    );
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir="ltr" data-locale={locale} suppressHydrationWarning>
        <body
          className={`${inter.variable} ${playfair.variable} flex min-h-dvh flex-col bg-cream font-sans text-brown-deep antialiased`}
        >
          <SpotlightCursor />
          <CustomCursor />
          <NextIntlClientProvider messages={messages}>
            <Navbar />
          <main className="mx-auto min-h-[calc(100vh-var(--navbar-height))] w-full max-w-6xl flex-1 px-6 pb-10 pt-[var(--navbar-height)] md:px-6">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
