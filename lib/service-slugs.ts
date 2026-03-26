/** Canonical URL slugs for services (matches Supabase `services.slug`). */
export const SERVICE_SLUGS = [
  'grafik-tasarim',
  'ceviri',
  'seslendirme',
  'icerik-uretimi',
  'fotograf-video',
  'web-yazilim',
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export function isServiceSlug(s: string): s is ServiceSlug {
  return (SERVICE_SLUGS as readonly string[]).includes(s);
}
