'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const switchLocale = (next: string) => {
    router.replace(pathname, { locale: next });
    setOpen(false);
  };

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

  const isActive = (href: string) =>
    href === '/'
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-beige/80 bg-cream/88 backdrop-blur-md transition-shadow ${
        scrolled ? 'shadow-[0_6px_18px_rgba(61,31,16,0.08)]' : ''
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-3.5">
        <Link href="/" className="flex shrink-0 items-center" aria-label="Toprak & Co.">
          <Image
            src="/photos/LOGO.png"
            alt=""
            width={200}
            height={48}
            priority
            className="h-8 w-auto max-w-[min(180px,55vw)] object-contain object-left md:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-5 md:flex" aria-label="Primary">
          {navKeys.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              className={`relative pb-1 text-[13px] text-brown-deep transition-colors hover:text-terracotta ${
                isActive(href)
                  ? 'after:absolute after:-bottom-[2px] after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-terracotta'
                  : ''
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-start gap-2 text-xs uppercase tracking-[0.2em] text-brown-deep md:flex">
          {routing.locales.map((loc, idx) => (
            <span key={loc} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => switchLocale(loc)}
                className={loc === locale ? 'text-terracotta' : 'opacity-70 hover:opacity-100'}
              >
                {loc}
              </button>
              {idx === 0 ? <span className="opacity-50">|</span> : null}
            </span>
          ))}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-beige p-1.5 text-brown-deep md:hidden"
          aria-expanded={open}
          aria-controls="mobile-overlay-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">
            {open ? t('closeMenu') : t('openMenu')}
          </span>
          <span aria-hidden className="text-lg leading-none">
            {open ? '×' : '≡'}
          </span>
        </button>
      </div>

      {open ? (
        <div
          id="mobile-overlay-nav"
          className="fixed inset-0 top-[64px] bg-cream px-6 py-8 md:hidden"
        >
          <div className="flex h-full flex-col gap-6">
            {navKeys.map(({ href, key }) => (
              <Link
                key={key}
                href={href}
                className={`font-serif text-3xl text-brown-deep ${
                  isActive(href) ? 'text-terracotta underline decoration-terracotta' : ''
                }`}
                onClick={() => setOpen(false)}
              >
                {t(key)}
              </Link>
            ))}
            <div className="mt-auto flex gap-2 pt-2 text-sm uppercase tracking-[0.2em]">
              {routing.locales.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => switchLocale(loc)}
                  className={loc === locale ? 'text-terracotta' : 'text-brown-deep opacity-70'}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
