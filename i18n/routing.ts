import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['tr', 'en', 'de', 'fr'],
  defaultLocale: 'tr',
  localePrefix: 'always',
});
