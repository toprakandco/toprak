import type { ServiceSlug } from '@/lib/service-slugs';

type Props = {
  slug: ServiceSlug;
  className?: string;
};

const stroke = 'currentColor';
const baseStroke = {
  fill: 'none' as const,
  stroke,
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function ServiceOrganicIcon({ slug, className = '' }: Props) {
  const cn = `text-leaf ${className}`.trim();

  switch (slug) {
    case 'grafik-tasarim':
      return (
        <svg
          viewBox="0 0 96 96"
          className={cn}
          fill="none"
          aria-hidden
        >
          <path
            {...baseStroke}
            d="M48 12c-8 22-4 44 8 62M28 28c12 8 24 6 36-2M20 52c18 4 32-2 44-14"
          />
          <path
            {...baseStroke}
            d="M52 76c6-10 14-18 24-22M40 84c-4-8-2-18 6-24"
            opacity={0.85}
          />
          <circle cx="34" cy="38" r="3" fill="currentColor" opacity={0.2} />
          <path
            {...baseStroke}
            d="M62 44c4 6 3 14-2 20"
            opacity={0.7}
          />
        </svg>
      );
    case 'ceviri':
      return (
        <svg viewBox="0 0 96 96" className={cn} aria-hidden>
          <path {...baseStroke} d="M22 28h28M30 20v16" />
          <path {...baseStroke} d="M18 48h36M22 56h28M26 64h20" />
          <path
            {...baseStroke}
            d="M58 32c10 2 18 10 20 20M54 68l20-8"
            opacity={0.85}
          />
          <path
            {...baseStroke}
            d="M72 24l6 6-6 6M14 72l6 6-6 6"
          />
        </svg>
      );
    case 'seslendirme':
      return (
        <svg viewBox="0 0 96 96" className={cn} aria-hidden>
          <path
            {...baseStroke}
            d="M40 36c0-8 6-14 14-14s14 6 14 14v20c0 8-6 14-14 14h-2"
          />
          <path {...baseStroke} d="M40 36v28c0 8 7 15 15 15h1" />
          <path {...baseStroke} d="M24 44v16c0 12 10 22 22 22" />
          <path {...baseStroke} d="M72 40v32M78 46v20" />
        </svg>
      );
    case 'icerik-uretimi':
      return (
        <svg viewBox="0 0 96 96" className={cn} aria-hidden>
          <rect
            x="22"
            y="20"
            width="44"
            height="56"
            rx="4"
            {...baseStroke}
          />
          <path {...baseStroke} d="M30 34h28M30 46h24M30 58h18" />
          <path
            {...baseStroke}
            d="M58 14c8 4 14 12 16 22M54 88c6-4 10-10 12-18"
            opacity={0.75}
          />
        </svg>
      );
    case 'fotograf-video':
      return (
        <svg viewBox="0 0 96 96" className={cn} aria-hidden>
          <rect
            x="16"
            y="30"
            width="48"
            height="36"
            rx="4"
            {...baseStroke}
          />
          <circle cx="40" cy="48" r="10" {...baseStroke} />
          <path {...baseStroke} d="M64 38l16-8v36l-16-8" />
          <path
            {...baseStroke}
            d="M28 78c6-4 12-6 20-6s14 2 20 6"
            opacity={0.65}
          />
        </svg>
      );
    case 'web-yazilim':
      return (
        <svg viewBox="0 0 96 96" className={cn} aria-hidden>
          <path {...baseStroke} d="M14 28h68M20 44h20M42 44h34M26 60h44" />
          <path {...baseStroke} d="M18 20l8 8-8 8M78 20l-8 8 8 8" />
          <path
            {...baseStroke}
            d="M48 68v12M38 78h20"
            opacity={0.8}
          />
          <circle cx="72" cy="52" r="3" fill="currentColor" opacity={0.25} />
        </svg>
      );
    default:
      return null;
  }
}
