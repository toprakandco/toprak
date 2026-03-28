'use client';

import { Link } from '@/i18n/navigation';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function WavyUnderline({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 14"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 8 Q 18 3 34 8 T 66 8 T 98 8 T 118 6"
        stroke="#8B3A1E"
        strokeWidth={1.25}
        strokeLinecap="round"
        opacity={0.65}
      />
    </svg>
  );
}

function HandsIllustration() {
  const reduce = useReducedMotion();
  const d1 = 'M 48 175 C 52 120 68 78 98 52 C 118 36 138 32 158 38';
  const d2 = 'M 232 175 C 228 120 212 78 182 52 C 162 36 142 32 122 38';

  return (
    <div className="relative mx-auto w-full max-w-[280px] lg:mx-0" aria-hidden>
      <svg
        viewBox="0 0 280 190"
        className="h-auto w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d={d1}
          stroke="#8B3A1E"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 2, ease: 'easeInOut' }}
          style={{ opacity: 0.15 }}
        />
        <motion.path
          d={d2}
          stroke="#8B3A1E"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduce ? 0 : 2, delay: reduce ? 0 : 0.15, ease: 'easeInOut' }}
          style={{ opacity: 0.15 }}
        />
        <motion.circle
          cx={140}
          cy={34}
          r={5}
          fill="#8B3A1E"
          fillOpacity={0.12}
          initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: reduce ? 0 : 1.65, duration: 0.35, ease }}
        />
      </svg>
    </div>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M4 7h16v10H4z" strokeLinejoin="round" />
      <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" strokeLinejoin="round" />
      <circle cx={12} cy={10} r={2.5} />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <circle cx={12} cy={12} r={9} />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.65" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

type CardProps = {
  icon: ReactNode;
  title: string;
  value: string;
  href?: string;
};

function InfoCard({ icon, title, value, href }: CardProps) {
  const inner = (
    <>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-accent">{icon}</span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3D1F10]/55">
            {title}
          </p>
          <p className="mt-1 text-[15px] font-medium text-[#3D1F10]">{value}</p>
        </div>
      </div>
    </>
  );

  const className =
    'block rounded-xl border border-[#EDE4D3] bg-white px-5 py-4 transition-[transform,border-color] duration-300 ease-out hover:border-accent hover:translate-x-[4px] motion-reduce:transition-none motion-reduce:hover:translate-x-0';

  if (href) {
    return (
      <a href={href} className={className} style={{ borderWidth: '0.5px' }}>
        {inner}
      </a>
    );
  }

  return (
    <div className={className} style={{ borderWidth: '0.5px' }}>
      {inner}
    </div>
  );
}

export function ContactHeroSection() {
  const t = useTranslations('contact.hero');

  return (
    <section
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 bg-[#F5F0E6] py-20"
      aria-labelledby="contact-hero-heading"
    >
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="mx-auto w-full max-w-[560px] lg:mx-0">
            <p
              className="text-[10px] font-medium uppercase tracking-[0.22em] text-accent"
              style={{ letterSpacing: '0.22em' }}
            >
              {t('overline')}
            </p>

            <h1
              id="contact-hero-heading"
              className="mt-5 font-serif leading-[1.12] text-[#3D1F10]"
              style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
            >
              <span>{t('titleBefore')}</span>
              <span className="relative inline-block">
                <span className="italic text-accent">{t('titleHighlight')}</span>
                <WavyUnderline className="absolute -bottom-1 left-0 w-[min(100%,7.5rem)]" />
              </span>
              <span>{t('titleAfter')}</span>
            </h1>

            <p className="mt-8 max-w-[480px] whitespace-pre-line text-base leading-[1.85] text-[#6B4C35]">
              {t('intro')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/start"
                className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-accent bg-transparent px-6 py-2.5 font-sans text-sm font-semibold text-accent transition hover:bg-accent/8"
                aria-label={t('projectCtaAria')}
              >
                {t('projectCta')}
              </Link>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <InfoCard
                icon={<MailIcon className="h-5 w-5" />}
                title={t('cards.email.title')}
                value={t('cards.email.value')}
                href={`mailto:${t('cards.email.value')}`}
              />
              <InfoCard
                icon={<PinIcon className="h-5 w-5" />}
                title={t('cards.location.title')}
                value={t('cards.location.value')}
              />
              <InfoCard
                icon={<ClockIcon className="h-5 w-5" />}
                title={t('cards.response.title')}
                value={t('cards.response.value')}
              />
            </div>

            <div className="mt-8 flex items-center gap-4">
              <a
                href={t('social.instagram')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent transition hover:scale-[1.2] hover:text-accent-dark"
                aria-label={t('social.instagramAria')}
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={t('social.linkedin')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent transition hover:scale-[1.2] hover:text-accent-dark"
                aria-label={t('social.linkedinAria')}
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
              <a
                href={t('social.youtube')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent transition hover:scale-[1.2] hover:text-accent-dark"
                aria-label={t('social.youtubeAria')}
              >
                <YouTubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="hidden justify-center lg:flex lg:justify-end">
            <HandsIllustration />
          </div>
        </div>

        <div className="mt-12 flex justify-center lg:hidden">
          <HandsIllustration />
        </div>
      </div>
    </section>
  );
}
