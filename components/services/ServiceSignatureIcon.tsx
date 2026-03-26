import type { ServiceSlug } from '@/lib/service-slugs';

type Props = {
  slug: ServiceSlug;
  className?: string;
};

const primary = '#5C7A52';
const secondary = '#7A9E6E';
const accent = '#C4824A';

export function ServiceSignatureIcon({ slug, className = '' }: Props) {
  const cn = className.trim();

  switch (slug) {
    case 'grafik-tasarim':
      return (
        <svg viewBox="0 0 64 64" className={cn} fill="none" aria-hidden>
          <path d="M30 54V18M30 28c-8-5-12-13-11-22 6 2 10 8 11 16" stroke={primary} strokeWidth={1.6} strokeLinecap="round"/>
          <path d="M30 30c8-5 12-13 11-22-6 2-10 8-11 16" stroke={secondary} strokeWidth={1.4} strokeLinecap="round"/>
          <circle cx="42" cy="38" r="8" stroke={accent} strokeWidth={1.6} />
          <path d="M37 43l10-10" stroke={primary} strokeWidth={1.4} strokeLinecap="round"/>
        </svg>
      );
    case 'ceviri':
      return (
        <svg viewBox="0 0 64 64" className={cn} fill="none" aria-hidden>
          <path d="M10 18h22M10 28h18M10 38h20" stroke={primary} strokeWidth={1.6} strokeLinecap="round"/>
          <path d="M34 22h20M34 32h16M34 42h18" stroke={secondary} strokeWidth={1.4} strokeLinecap="round"/>
          <path d="M26 30h9m0 0-3-3m3 3-3 3" stroke={accent} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'seslendirme':
      return (
        <svg viewBox="0 0 64 64" className={cn} fill="none" aria-hidden>
          <rect x="24" y="12" width="16" height="26" rx="8" stroke={primary} strokeWidth={1.6}/>
          <path d="M18 28v4c0 8 6 14 14 14s14-6 14-14v-4" stroke={secondary} strokeWidth={1.5} strokeLinecap="round"/>
          <path d="M32 46v8" stroke={primary} strokeWidth={1.5} strokeLinecap="round"/>
          <path d="M14 22c-3 2-5 6-5 10s2 8 5 10M50 22c3 2 5 6 5 10s-2 8-5 10" stroke={accent} strokeWidth={1.4} strokeLinecap="round"/>
        </svg>
      );
    case 'icerik-uretimi':
      return (
        <svg viewBox="0 0 64 64" className={cn} fill="none" aria-hidden>
          <rect x="16" y="10" width="28" height="42" rx="4" stroke={primary} strokeWidth={1.6}/>
          <path d="M22 20h16M22 28h14M22 36h12" stroke={secondary} strokeWidth={1.4} strokeLinecap="round"/>
          <path d="M50 20l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" stroke={accent} strokeWidth={1.4} strokeLinejoin="round"/>
        </svg>
      );
    case 'fotograf-video':
      return (
        <svg viewBox="0 0 64 64" className={cn} fill="none" aria-hidden>
          <rect x="10" y="18" width="34" height="28" rx="5" stroke={primary} strokeWidth={1.6}/>
          <circle cx="27" cy="32" r="7" stroke={secondary} strokeWidth={1.4}/>
          <path d="M44 24l10-5v26l-10-5" stroke={accent} strokeWidth={1.5} strokeLinejoin="round"/>
          <path d="M16 14h10" stroke={primary} strokeWidth={1.5} strokeLinecap="round"/>
        </svg>
      );
    case 'web-yazilim':
      return (
        <svg viewBox="0 0 64 64" className={cn} fill="none" aria-hidden>
          <rect x="8" y="14" width="48" height="34" rx="5" stroke={primary} strokeWidth={1.6}/>
          <path d="M8 22h48" stroke={secondary} strokeWidth={1.4}/>
          <path d="M24 32l-5 4 5 4M40 32l5 4-5 4" stroke={accent} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M31 30l-3 12" stroke={primary} strokeWidth={1.4} strokeLinecap="round"/>
        </svg>
      );
    default:
      return null;
  }
}
