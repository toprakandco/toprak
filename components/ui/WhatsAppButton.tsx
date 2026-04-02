'use client';

import { useLocale } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

const PROACTIVE_DISMISS_KEY = 'pk-whatsapp-proactive-tooltip-dismissed';

function getMessageForPath(pathname: string, locale: string): string {
  if (pathname.includes('/services/grafik-tasarim')) {
    switch (locale) {
      case 'tr':
        return 'Merhaba, grafik tasarım hizmeti hakkında bilgi almak istiyorum.';
      case 'de':
        return 'Hallo, ich interessiere mich für Ihre Grafikdesign-Leistungen.';
      case 'fr':
        return 'Bonjour, je souhaite en savoir plus sur vos services de design graphique.';
      default:
        return "Hello, I'm interested in your graphic design services.";
    }
  }
  if (pathname.includes('/services/ceviri')) {
    switch (locale) {
      case 'tr':
        return 'Merhaba, çeviri hizmeti hakkında bilgi almak istiyorum.';
      case 'de':
        return 'Hallo, ich möchte mehr über Ihre Übersetzungsleistungen erfahren.';
      case 'fr':
        return 'Bonjour, je souhaite en savoir plus sur vos services de traduction.';
      default:
        return 'Hello, I would like to learn more about your translation services.';
    }
  }
  if (pathname.includes('/services/seslendirme')) {
    switch (locale) {
      case 'tr':
        return 'Merhaba, seslendirme hizmeti hakkında bilgi almak istiyorum.';
      case 'de':
        return 'Hallo, ich möchte mehr über Ihre Sprachaufnahme-Leistungen erfahren.';
      case 'fr':
        return 'Bonjour, je souhaite en savoir plus sur vos services de voix off.';
      default:
        return 'Hello, I would like to learn more about your voice-over services.';
    }
  }
  if (pathname.includes('/blog')) {
    switch (locale) {
      case 'tr':
        return 'Merhaba, Toprak & Co. hakkında bilgi almak istiyorum.';
      case 'de':
        return 'Hallo, ich möchte mehr über Toprak & Co. erfahren.';
      case 'fr':
        return 'Bonjour, je souhaite en savoir plus sur Toprak & Co.';
      default:
        return "Hello, I'd like to learn more about Toprak & Co.";
    }
  }
  switch (locale) {
    case 'tr':
      return 'Merhaba, Toprak & Co. hakkında bilgi almak istiyorum.';
    case 'de':
      return 'Hallo, ich möchte mehr über Toprak & Co. erfahren.';
    case 'fr':
      return 'Bonjour, je souhaite en savoir plus sur Toprak & Co.';
    default:
      return "Hello, I'd like to learn more about Toprak & Co.";
  }
}

function buildWaUrl(phoneDigits: string, message: string) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${phoneDigits}?text=${text}`;
}

export function WhatsAppButton() {
  const pathname = usePathname() ?? '';
  const locale = useLocale();
  const [proactiveOpen, setProactiveOpen] = useState(false);

  const waMessage = useMemo(
    () => getMessageForPath(pathname, locale),
    [pathname, locale],
  );

  const raw =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ??
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ??
    '';
  const digits = raw.replace(/\D/g, '');
  const hideOnAdmin = pathname.startsWith('/admin');
  const showWidget = !hideOnAdmin && !!digits;

  useEffect(() => {
    if (!showWidget) return;
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(PROACTIVE_DISMISS_KEY) === '1') return;

    setProactiveOpen(false);

    const t = window.setTimeout(() => {
      if (sessionStorage.getItem(PROACTIVE_DISMISS_KEY) === '1') return;
      setProactiveOpen(true);
    }, 30_000);

    return () => window.clearTimeout(t);
  }, [pathname, showWidget]);

  if (!showWidget) {
    return null;
  }

  const dismissProactive = () => {
    try {
      sessionStorage.setItem(PROACTIVE_DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
    setProactiveOpen(false);
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 flex max-w-[min(18rem,calc(100vw-3rem))] flex-col items-end gap-2 overflow-visible">
      {proactiveOpen && (
        <div
          className="whatsapp-proactive-tooltip pointer-events-auto relative rounded-xl border-[0.5px] border-[#EDE4D3] bg-white py-2.5 pl-3 pr-9 text-left shadow-md"
          role="status"
        >
          <p className="font-sans text-xs leading-snug text-[#3D1F10]">
            Merhaba 👋 Size nasıl yardımcı olabiliriz?
          </p>
          <button
            type="button"
            className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-md text-[#6B5344] transition-colors hover:bg-[#F5F0E6] hover:text-[#3D1F10]"
            aria-label="Kapat"
            onClick={dismissProactive}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="pointer-events-auto group relative">
        <div className="whatsapp-float-pulse relative h-14 w-14 shrink-0">
          <button
            type="button"
            className="relative z-[1] flex h-14 w-14 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.35)] transition-[transform,box-shadow] hover:scale-[1.08] hover:shadow-[0_8px_32px_rgba(37,211,102,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
            aria-label="WhatsApp ile iletişime geçin"
            onClick={() => {
              window.open(
                buildWaUrl(digits, waMessage),
                '_blank',
                'noopener,noreferrer',
              );
            }}
          >
            <svg
              width={28}
              height={28}
              viewBox="0 0 24 24"
              aria-hidden
              className="shrink-0"
            >
              <path
                fill="currentColor"
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
              />
            </svg>
          </button>
        </div>

        <div
          className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 z-[1] -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100"
          role="tooltip"
        >
          <div className="flex items-stretch overflow-hidden rounded-lg border-[0.5px] border-[#EDE4D3] bg-white shadow-sm">
            <span className="flex items-center px-3 py-1.5 font-sans text-xs leading-none text-[#3D1F10]">
              WhatsApp&apos;tan yazın
            </span>
            <span className="relative flex w-2 shrink-0 items-stretch border-l border-[#EDE4D3] bg-white">
              <svg
                className="h-full min-h-[2.25rem] w-full text-white"
                viewBox="0 0 8 24"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  fill="currentColor"
                  stroke="#EDE4D3"
                  strokeWidth={0.5}
                  d="M0 0.25 L7.5 12 L0 23.75 Z"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
