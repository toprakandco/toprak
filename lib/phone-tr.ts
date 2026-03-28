/** Sadece rakamlar, max 11 (05… GSM). */
export function parseTurkishGsmDigits(input: string): string {
  let d = input.replace(/\D/g, '');
  if (d.startsWith('90') && d.length >= 12) {
    d = `0${d.slice(2)}`;
  }
  if (d.length === 10 && d.startsWith('5')) {
    d = `0${d}`;
  }
  return d.slice(0, 11);
}

/** 05XX XXX XX XX */
export function formatTurkishGsmDisplay(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 4) return d;
  const a = d.slice(0, 4);
  const b = d.slice(4, 7);
  const c = d.slice(7, 9);
  const e = d.slice(9, 11);
  return [a, b, c, e].filter(Boolean).join(' ');
}

export function isValidTurkishGsm11(digits: string): boolean {
  const d = digits.replace(/\D/g, '');
  return d.length === 11 && /^05\d{9}$/.test(d);
}
