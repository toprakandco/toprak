import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

export async function Footer() {
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');

  return (
    <footer className="mt-auto bg-brown-deep text-cream" data-spotlight-dark>
      <div className="mx-auto max-w-6xl px-6 pt-14 md:px-6">
        <div className="grid gap-10 text-center md:grid-cols-3 md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Link
              href="/"
              className="inline-flex rounded-lg bg-cream/95 p-2 shadow-sm ring-1 ring-cream/20"
              aria-label="Toprak & Co."
            >
              <Image
                src="/photos/LOGO.png"
                alt=""
                width={176}
                height={44}
                className="h-9 w-auto max-w-[200px] object-contain object-left"
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/80 md:mx-0">
              {t('tagline')}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-cream/70">
              {t('quicklinks')}
            </h3>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/services" className="hover:text-gold">
                {tNav('services')}
              </Link>
              <Link href="/portfolio" className="hover:text-gold">
                {tNav('portfolio')}
              </Link>
              <Link href="/blog" className="hover:text-gold">
                {tNav('blog')}
              </Link>
              <Link href="/about" className="hover:text-gold">
                {tNav('about')}
              </Link>
              <Link href="/contact" className="hover:text-gold">
                {tNav('contact')}
              </Link>
              <Link href="/contact#sss" className="hover:text-gold">
                {tNav('sss')}
              </Link>
              <Link href="/kvkk" className="hover:text-gold">
                {t('privacyPolicy')}
              </Link>
            </nav>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-4 text-xs uppercase tracking-[0.2em] text-cream/70">
              {t('contact')}
            </h3>
            <a
              href="mailto:info@toprakco.tr"
              className="text-sm hover:text-gold"
            >
              info@toprakco.tr
            </a>
            <div className="mt-4 flex flex-col gap-2 text-sm text-cream/85">
              <span>Instagram</span>
              <span>LinkedIn</span>
              <span>YouTube</span>
            </div>
          </div>
        </div>

        <div className="my-8">
          <svg
            viewBox="0 0 600 20"
            className="h-5 w-full text-leaf/60"
            aria-hidden="true"
          >
            <path
              d="M0 10 C90 1, 130 19, 220 10 C310 1, 350 19, 440 10 C510 3, 550 16, 600 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M300 10 C295 6, 293 3, 295 1 C300 2, 304 5, 306 10 C304 15, 300 18, 295 19 C293 17, 295 14, 300 10 Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pb-8 text-center text-xs text-cream/70">
          <span>© 2026 Toprak &amp; Co.</span>
          <span>{t('rights')}</span>
        </p>
      </div>
    </footer>
  );
}
