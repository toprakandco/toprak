import type { AbstractIntlMessages } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import enMessages from '../messages/en.json';
import trMessages from '../messages/tr.json';
import { routing } from './routing';

const messagesByLocale: Record<
  (typeof routing.locales)[number],
  AbstractIntlMessages
> = {
  tr: trMessages as unknown as AbstractIntlMessages,
  en: enMessages as unknown as AbstractIntlMessages,
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locales = routing.locales as readonly string[];
  const locale =
    typeof requested === 'string' && locales.includes(requested)
      ? requested
      : routing.defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale as keyof typeof messagesByLocale],
  };
});
