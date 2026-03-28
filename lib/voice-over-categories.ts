/** URL `type` param values for seslendirme voice-over selector ↔ contact prefill. */
export const VOICE_OVER_CATEGORY_IDS = [
  'reklam',
  'belgesel-haber',
  'elearning',
  'kitap',
  'animasyon-oyun',
  'kurumsal-ivr',
] as const;

export type VoiceOverCategoryId = (typeof VOICE_OVER_CATEGORY_IDS)[number];

export function isVoiceOverCategoryId(s: string): s is VoiceOverCategoryId {
  return (VOICE_OVER_CATEGORY_IDS as readonly string[]).includes(s);
}
