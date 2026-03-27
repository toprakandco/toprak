'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export function SssRedirectClient() {
  const pathname = usePathname();
  const t = useTranslations('sss');

  useEffect(() => {
    const locale = pathname.split('/').filter(Boolean)[0] || 'tr';
    window.location.replace(`/${locale}/contact#sss`);
  }, [pathname]);

  return (
    <div className="container py-16 text-center text-sm text-brown-deep/70">
      <p>{t('redirecting')}</p>
    </div>
  );
}
