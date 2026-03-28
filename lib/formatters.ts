const WORDS_PER_MINUTE = 200;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Blog/article dates: TR "24 Mart 2026", EN "24 March 2026" (en-GB). */
export function formatDate(dateStr: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-GB', {
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
  return locale === 'tr' ? `~${mins} dk okuma` : `~${mins} min read`;
}

export function formatCurrency(amount: number, locale: string): string {
  return locale === 'tr'
    ? `${amount.toLocaleString('tr-TR')} ₺`
    : `₺${amount.toLocaleString('en-GB')}`;
}
