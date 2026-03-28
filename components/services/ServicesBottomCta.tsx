import { Link } from '@/i18n/navigation';

type Props = {
  title: string;
  subtitle: string;
  button: string;
  buttonStart?: string;
};

export function ServicesBottomCta({ title, subtitle, button, buttonStart }: Props) {
  return (
    <section className="bg-terracotta py-10" data-spotlight-dark>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-[max(24px,5vw)] md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-serif text-[clamp(24px,3.2vw,28px)] text-cream">{title}</h2>
          <p className="mt-2 text-[13px] text-cream/65">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/contact"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-cream px-8 py-3 text-sm font-semibold text-terracotta transition hover:scale-[1.02] hover:bg-beige"
          >
            {button}
          </Link>
          {buttonStart ? (
            <Link
              href="/start"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-cream/90 bg-transparent px-7 py-3 text-sm font-semibold text-cream transition hover:bg-cream/10"
            >
              {buttonStart}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
