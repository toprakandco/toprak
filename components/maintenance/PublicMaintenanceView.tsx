type Props = {
  locale: string;
  settings: Record<string, string>;
};

export function PublicMaintenanceView({ locale, settings }: Props) {
  const msg =
    locale === 'en'
      ? settings.maintenance_message_en?.trim() || 'We will be back soon.'
      : settings.maintenance_message_tr?.trim() || 'Yakında döneceğiz.';

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-cream px-6 text-center text-[#3D1F10]">
      <p className="font-serif text-sm uppercase tracking-[0.2em] text-[#8B3A1E]/80">
        Toprak & Co.
      </p>
      <h1 className="mt-4 font-serif text-3xl md:text-4xl">
        {locale === 'en' ? 'We’ll be right back' : 'Kısa bir ara veriyoruz'}
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-[#6B4C35]">{msg}</p>
    </div>
  );
}
