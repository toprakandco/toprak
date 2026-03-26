import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('nav');

  return (
    <div className="py-16 text-center">
      <h1 className="font-serif text-3xl text-navy">404</h1>
      <p className="mt-2 text-navy-light">
        Sayfa bulunamadı · Page not found
      </p>
      <Link
        href="/"
        className="mt-6 inline-block text-gold underline-offset-4 hover:underline"
      >
        {t('home')}
      </Link>
    </div>
  );
}
