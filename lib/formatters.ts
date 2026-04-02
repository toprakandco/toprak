const WORDS_PER_MINUTE = 200;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

const intlLocaleFor = (locale: string) => {
  if (locale === 'tr') return 'tr-TR';
  if (locale === 'de') return 'de-DE';
  if (locale === 'fr') return 'fr-FR';
  return 'en-GB';
};

/** Blog/article dates by UI locale. */
export function formatDate(dateStr: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(intlLocaleFor(locale), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

/** Plain-text reading time label from HTML content. */
export function readingTime(content: string, locale: string): string {
  const text = stripHtml(content ?? '');
  const words = text.split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  if (locale === 'tr') return `~${mins} dk okuma`;
  if (locale === 'de') return `~${mins} Min. Lesezeit`;
  if (locale === 'fr') return `~${mins} min de lecture`;
  return `~${mins} min read`;
}

export function formatCurrency(amount: number, locale: string): string {
  const loc = intlLocaleFor(locale);
  return locale === 'tr'
    ? `${amount.toLocaleString('tr-TR')} ₺`
    : `₺${amount.toLocaleString(loc)}`;
}
