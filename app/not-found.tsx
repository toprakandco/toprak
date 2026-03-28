import { NotFoundView } from '@/components/not-found/NotFoundView';
import { Inter, Playfair_Display } from 'next/font/google';
import { headers } from 'next/headers';
import './globals.css';

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

const COPY = {
  tr: {
    title: 'Bu toprakta henüz bir şey yetişmedi.',
    subtitle: 'Aradığınız sayfa bulunamadı.',
    primaryCta: 'Ana Sayfaya Dön',
    secondaryCta: 'Bize Yazın',
  },
  en: {
    title: 'Nothing has grown here yet.',
    subtitle: 'The page you are looking for could not be found.',
    primaryCta: 'Back to home',
    secondaryCta: 'Contact us',
  },
} as const;

function pickLocale(accept: string | null): keyof typeof COPY {
  if (!accept) return 'tr';
  const first = accept.split(',')[0]?.trim().toLowerCase() ?? '';
  if (first.startsWith('en')) return 'en';
  return 'tr';
}

export default async function NotFound() {
  const h = await headers();
  const locale = pickLocale(h.get('accept-language'));
  const c = COPY[locale];

  return (
    <div
      className={`${inter.variable} ${playfair.variable} min-h-[100svh] bg-[#F5F0E6] font-sans text-brown-deep antialiased`}
    >
      <NotFoundView
        title={c.title}
        subtitle={c.subtitle}
        primaryLabel={c.primaryCta}
        secondaryLabel={c.secondaryCta}
        linkMode="static"
        localePrefix={`/${locale}`}
      />
    </div>
  );
}
