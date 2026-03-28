import { NotFoundView } from '@/components/not-found/NotFoundView';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <NotFoundView
      title={t('title')}
      subtitle={t('subtitle')}
      primaryLabel={t('primaryCta')}
      secondaryLabel={t('secondaryCta')}
      linkMode="intl"
      withNavbarOffset
    />
  );
}
