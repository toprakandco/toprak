'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { motion, useReducedMotion } from 'framer-motion';

const navKeys = [
  { href: '/services', key: 'services' as const },
  { href: '/portfolio', key: 'portfolio' as const },
  { href: '/blog', key: 'blog' as const },
  { href: '/about', key: 'about' as const },
  { href: '/contact', key: 'contact' as const },
];

export function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname, locale]);

  const isActive = (href: string) =>
    href === '/'
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const localeLabel = (loc: string) =>
    loc === 'tr' ? t('localeCodeTr') : t('localeCodeEn');

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-[var(--navbar-height)] border-b-2 border-accent bg-cream/88 backdrop-blur-md transition-[border-color,box-shadow] duration-[400ms] ease-in-out motion-reduce:transition-none md:[backdrop-filter:blur(12px)] md:[-webkit-backdrop-filter:blur(12px)] ${
          scrolled ? 'shadow-[0_6px_18px_rgba(61,31,16,0.08)]' : ''
        }`}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
          <Link
            href="/"
            className="flex h-[26px] shrink-0 items-center md:h-[30px]"
            aria-label={t('logoHome')}
          >
            <Image
              src="/photos/LOGO.png"
              alt=""
              width={160}
              height={38}
              priority
              className="h-full w-auto max-w-[min(132px,46vw)] object-contain object-left"
            />
          </Link>

          <nav className="hidden items-center gap-5 md:flex" aria-label="Primary">
            {navKeys.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                className={`relative pb-1 text-[13px] text-brown-deep transition-colors hover:text-accent ${
                  isActive(href)
                    ? 'text-accent after:absolute after:-bottom-[2px] after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-accent'
                    : ''
                }`}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          <div
            className="hidden items-center gap-3 text-xs uppercase tracking-[0.2em] text-brown-deep md:flex"
            role="group"
            aria-label={t('language')}
          >
            {routing.locales.map((loc, idx) => (
              <span key={loc} className="flex items-center gap-3">
                {loc === locale ? (
                  <span
                    className="cursor-default font-semibold text-accent"
                    aria-current="true"
                  >
                    {localeLabel(loc)}
                  </span>
                ) : (
                  <Link
                    href={pathname}
                    locale={loc}
                    className="opacity-65 transition hover:opacity-100"
                    aria-label={
                      loc === 'tr' ? t('switchToTurkish') : t('switchToEnglish')
                    }
                  >
                    {localeLabel(loc)}
                  </Link>
                )}
                {idx === 0 ? <span className="opacity-50">|</span> : null}
              </span>
            ))}
          </div>

          <button
            type="button"
            className="nav-hamburger md:hidden"
            aria-expanded={open}
            aria-controls="mobile-overlay-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav-hamburger-line" aria-hidden />
            <span className="nav-hamburger-line" aria-hidden />
            <span className="nav-hamburger-line" aria-hidden />
            <span className="sr-only">
              {open ? t('closeMenu') : t('openMenu')}
            </span>
          </button>
        </div>
      </header>

      {open ? (
        <div
          id="mobile-overlay-nav"
          className="fixed inset-0 z-[49] flex max-h-[100dvh] flex-col bg-[#F5F0E6] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t('openMenu')}
          onClick={() => setOpen(false)}
        >
          <div
            className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 overflow-y-auto px-6 py-10"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col items-center gap-8" aria-label="Primary">
              {navKeys.map(({ href, key }, i) => (
                <motion.div
                  key={key}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduce ? 0 : 0.12 + i * 0.05,
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={href}
                    className={`font-serif text-[32px] leading-tight text-[#3D1F10] ${
                      isActive(href) ? 'text-accent' : ''
                    }`}
                    aria-current={isActive(href) ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {t(key)}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div
              className="mt-8 flex flex-col items-center gap-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
              role="group"
              aria-label={t('language')}
            >
              <div className="flex items-center gap-6 text-sm uppercase tracking-[0.2em]">
                {routing.locales.map((loc) =>
                  loc === locale ? (
                    <span
                      key={loc}
                      className="cursor-default font-semibold text-accent"
                      aria-current="true"
                    >
                      {localeLabel(loc)}
                    </span>
                  ) : (
                    <Link
                      key={loc}
                      href={pathname}
                      locale={loc}
                      className="text-brown-deep/65"
                      onClick={() => setOpen(false)}
                      aria-label={
                        loc === 'tr'
                          ? t('switchToTurkish')
                          : t('switchToEnglish')
                      }
                    >
                      {localeLabel(loc)}
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
