import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { PublicMaintenanceView } from '@/components/maintenance/PublicMaintenanceView';
import { routing } from '@/i18n/routing';
import { getSiteSettingsMapSafe } from '@/lib/site-settings';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Inter, Playfair_Display } from 'next/font/google';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import '../globals.css';

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

  return {
    title: t('title'),
    description: t('description'),
    icons: {
      icon: [{ url: '/photos/FAVICON.JPEG', type: 'image/jpeg' }],
      shortcut: '/photos/FAVICON.JPEG',
      apple: '/photos/FAVICON.JPEG',
    },
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
      <html lang={locale} suppressHydrationWarning>
        <body
          className={`${inter.variable} ${playfair.variable} flex min-h-dvh flex-col bg-cream font-sans text-brown-deep antialiased`}
        >
          <PublicMaintenanceView locale={locale} settings={settings} />
        </body>
      </html>
    );
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} flex min-h-dvh flex-col bg-cream font-sans text-brown-deep antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="mx-auto min-h-[calc(100vh-var(--navbar-height))] w-full max-w-6xl flex-1 px-4 pb-10 pt-[var(--navbar-height)] md:px-6">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
