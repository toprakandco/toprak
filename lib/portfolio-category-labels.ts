import { SERVICE_SLUGS } from '@/lib/service-slugs';

const LABELS: Record<string, string> = {
  'grafik-tasarim': 'Grafik Tasarım',
  ceviri: 'Çeviri',
  seslendirme: 'Seslendirme',
  'icerik-uretimi': 'İçerik Üretimi',
  'fotograf-video': 'Fotoğraf & Video',
  'web-yazilim': 'Web & Yazılım',
};

export function portfolioCategoryLabel(slug: string | null): string {
  if (!slug) return '—';
  return LABELS[slug] ?? slug;
}

export function portfolioCategoryOptions() {
  return SERVICE_SLUGS.map((slug) => ({
    value: slug,
    label: LABELS[slug] ?? slug,
  }));
}
