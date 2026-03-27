'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden>
      <path
        d="M24 40V18M24 26c-6-5-10-12-8-20 4 3 7 8 8 14M24 26c6-5 10-12 8-20-4 3-7 8-8 14"
        stroke="currentColor"
        strokeWidth={1.35}
        strokeLinecap="round"
      />
      <path
        d="M12 20c-4 8-2 16 6 20 6-4 10-10 10-18-6-4-12-4-16-2z"
        fill="currentColor"
        opacity={0.28}
      />
    </svg>
  );
}

function firstChar(name: string): string {
  const t = name.trim();
  if (!t.length) return '?';
  return t[0];
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 7h16v10H4z" strokeLinejoin="round" />
      <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

type MemberProps = {
  memberKey: 'member1' | 'member2';
  skills: string[];
  side: 'left' | 'right';
};

function TeamMemberCard({ memberKey, skills, side }: MemberProps) {
  const t = useTranslations(
    memberKey === 'member1' ? 'about.team.member1' : 'about.team.member2',
  );
  const tTeam = useTranslations('about.team');
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const name = t('name');
  const letter = firstChar(name);
  const email = t('email');
  const instagramUrl = t('instagramUrl');
  const active = reduce || inView;
  const fromX = side === 'left' ? -40 : 40;

  return (
    <motion.div
      ref={ref}
      className="h-full"
      initial={false}
      animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: reduce ? 0 : fromX }}
      transition={{ duration: 0.8, ease }}
    >
      <article
        className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#EDE4D3] bg-white px-9 py-10 transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-[8px] hover:border-[#7A9E6E] hover:shadow-[0_24px_64px_rgba(122,158,110,0.12)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        style={{ borderWidth: '0.5px' }}
      >
      <span
        className="pointer-events-none absolute -bottom-4 -right-2 select-none font-serif font-medium leading-none text-[#8B3A1E]"
        style={{ fontSize: 200, opacity: 0.04 }}
        aria-hidden
      >
        {letter}
      </span>

      <div className="relative z-[1]">
        <div
          className="mb-6 flex h-[120px] w-[120px] items-center justify-center rounded-full border-[3px] border-[#EDE4D3] transition-transform duration-300 [background:linear-gradient(135deg,#EAF3DE,#F5F0E6)] group-hover:scale-105 group-hover:border-[#8B3A1E] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        >
          <LeafIcon className="h-14 w-14 text-[#7A9E6E]" />
        </div>

        <h3 className="font-serif text-[26px] leading-tight text-[#3D1F10]">{name}</h3>

        <p
          className="mb-4 mt-1 text-[13px] font-medium uppercase tracking-[0.08em] text-[#8B3A1E]"
          style={{ letterSpacing: '0.08em' }}
        >
          {t('role')}
        </p>

        <p
          className="text-[14px] leading-[1.8] text-[#7A6050]"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          {t('bio')}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-[#C0DD97] bg-[#EAF3DE] px-3 py-1 text-xs font-medium text-[#5C7A52]"
              style={{ borderWidth: '0.5px' }}
            >
              {skill}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex gap-4 border-t border-[#EDE4D3] pt-5">
          <a
            href={`mailto:${email}`}
            className="text-[#8B3A1E] transition-colors hover:text-[#6B2C14]"
            aria-label={tTeam('contactEmailAria', { name })}
          >
            <MailIcon className="h-5 w-5" />
          </a>
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B3A1E] transition-colors hover:text-[#6B2C14]"
              aria-label={tTeam('contactInstagramAria', { name })}
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          ) : null}
        </div>
      </div>
      </article>
    </motion.div>
  );
}

type Props = {
  member1Skills: string[];
  member2Skills: string[];
};

export function AboutTeamSection({ member1Skills, member2Skills }: Props) {
  const t = useTranslations('about.team');

  return (
    <section className="bg-[#F5F0E6] py-24">
      <div className="container">
        <p
          className="text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[#8B3A1E]"
          style={{ letterSpacing: '0.22em' }}
        >
          {t('overline')}
        </p>
        <h2 className="mt-4 text-center font-serif text-[clamp(1.75rem,4vw,2.75rem)] leading-tight text-[#3D1F10]">
          {t('heading')}
        </h2>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          <TeamMemberCard memberKey="member1" skills={member1Skills} side="left" />
          <TeamMemberCard memberKey="member2" skills={member2Skills} side="right" />
        </div>
      </div>
    </section>
  );
}
