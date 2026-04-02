'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

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
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const onChange = () => {
      if (mq.matches) setIsOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const isActive = (href: string) =>
    href === '/'
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const localeLabel = (loc: string) => {
    switch (loc) {
      case 'tr':
        return t('localeCodeTr');
      case 'en':
        return t('localeCodeEn');
      case 'de':
        return t('localeCodeDe');
      case 'fr':
        return t('localeCodeFr');
      default:
        return loc.toUpperCase();
    }
  };

  const switchAria = (loc: string) => {
    switch (loc) {
      case 'tr':
        return t('switchToTurkish');
      case 'en':
        return t('switchToEnglish');
      case 'de':
        return t('switchToGerman');
      case 'fr':
        return t('switchToFrench');
      default:
        return t('language');
    }
  };

  const localePillActive =
    'inline-flex min-h-[36px] min-w-[2.75rem] cursor-default items-center justify-center rounded-md bg-[#8B3A1E] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm';
  const localePillInactive =
    'inline-flex min-h-[36px] min-w-[2.75rem] items-center justify-center rounded-md bg-[#EDE4D3] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3D1F10] transition-colors hover:bg-[#8B3A1E] hover:text-white';

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

          <nav
            className="nav-links items-center gap-5"
            aria-label="Primary"
          >
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
            className="nav-lang items-center gap-2"
            role="group"
            aria-label={t('language')}
          >
            {routing.locales.map((loc) =>
              loc === locale ? (
                <span
                  key={loc}
                  className={localePillActive}
                  aria-current="true"
                >
                  {localeLabel(loc)}
                </span>
              ) : (
                <Link
                  key={loc}
                  href={pathname}
                  locale={loc}
                  className={localePillInactive}
                  aria-label={switchAria(loc)}
                >
                  {localeLabel(loc)}
                </Link>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-overlay-nav"
            aria-label={isOpen ? t('closeMenu') : t('openMenu')}
            className="hamburger-btn focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B3A1E]"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              width: '44px',
              height: '44px',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '8px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '2px',
                background: '#8B3A1E',
                borderRadius: '1px',
                transition: 'all 0.3s ease',
                transform: isOpen
                  ? 'translateY(8px) rotate(45deg)'
                  : 'translateY(0) rotate(0)',
              }}
              aria-hidden
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '2px',
                background: '#8B3A1E',
                borderRadius: '1px',
                transition: 'all 0.3s ease',
                opacity: isOpen ? 0 : 1,
                transform: isOpen ? 'scaleX(0)' : 'scaleX(1)',
              }}
              aria-hidden
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '2px',
                background: '#8B3A1E',
                borderRadius: '1px',
                transition: 'all 0.3s ease',
                transform: isOpen
                  ? 'translateY(-8px) rotate(-45deg)'
                  : 'translateY(0) rotate(0)',
              }}
              aria-hidden
            />
          </button>
        </div>
      </header>

      {isOpen ? (
        <div
          id="mobile-overlay-nav"
          role="dialog"
          aria-modal="true"
          aria-label={t('openMenu')}
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#F5F0E6',
            zIndex: 48,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          {navKeys.map(({ href, key }, i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              style={{
                fontFamily: 'Georgia, serif',
                fontSize: '32px',
                color: isActive(href) ? '#8B3A1E' : '#3D1F10',
                textDecoration: 'none',
                padding: '12px 24px',
                animation: `slideUp 0.3s ease ${i * 0.06}s both`,
              }}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              {t(key)}
            </Link>
          ))}

          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '0.5px solid #EDE4D3',
            }}
            role="group"
            aria-label={t('language')}
          >
            {routing.locales.map((lang) => (
              <Link
                key={lang}
                href={pathname}
                locale={lang}
                onClick={() => setIsOpen(false)}
                style={{
                  fontFamily: 'sans-serif',
                  fontSize: '12px',
                  letterSpacing: '0.12em',
                  color: locale === lang ? '#8B3A1E' : '#7A6050',
                  fontWeight: locale === lang ? '700' : '400',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}
                aria-label={switchAria(lang)}
                aria-current={locale === lang ? 'true' : undefined}
              >
                {lang.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
