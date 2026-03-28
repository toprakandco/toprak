'use client';

import { ServiceOrganicIcon } from '@/components/services/ServiceOrganicIcon';
import { Link } from '@/i18n/navigation';
import { SERVICE_SLUGS, type ServiceSlug } from '@/lib/service-slugs';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useId, useRef } from 'react';

type CardCopy = {
  title: string;
  description: string;
};

type Props = {
  overline: string;
  heading: string;
  detailCta: string;
  cards: Record<ServiceSlug, CardCopy>;
};

function GrainOverlay({ id }: { id: string }) {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]" aria-hidden>
      <filter id={id}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="2" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}

export function HomeServicesGrid({ overline, heading, detailCta, cards }: Props) {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-10% 0px' });
  const noiseId = useId().replace(/:/g, '');

  return (
    <section
      ref={sectionRef}
      id="services-preview"
      className="relative left-1/2 w-[100dvw] max-w-[100dvw] -translate-x-1/2 bg-white py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-[max(24px,5vw)]">
        <p className="text-center text-xs font-medium uppercase tracking-[0.35em] text-terracotta">
          {overline}
        </p>
        <div className="relative mx-auto mt-4 max-w-2xl text-center">
          <h2 className="font-serif text-[clamp(24px,4vw,48px)] text-brown-deep">{heading}</h2>
          <svg
            className="mx-auto mt-5 h-6 w-48 text-terracotta"
            viewBox="0 0 200 16"
            fill="none"
            aria-hidden
          >
            <motion.path
              d="M4 10c32-8 68-8 96 0 28 8 64 6 92-4"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />
          </svg>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_SLUGS.map((slug, i) => {
            const copy = cards[slug];
            return (
              <motion.article
                key={slug}
                className="home-service-card group relative overflow-hidden rounded-[16px] border border-[#EDE4D3] bg-white px-7 py-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#7A9E6E] hover:border-t-[3px] hover:border-t-[#7A9E6E] hover:shadow-[0_10px_28px_rgba(61,31,16,0.08)]"
                initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.08 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={i === 0 ? { backgroundColor: '#F9F6EF' } : undefined}
              >
                <GrainOverlay id={`n-${noiseId}-${slug}`} />
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#EAF3DE,#F5F0E6)] md:h-16 md:w-16">
                  <div className="home-service-icon relative h-7 w-7 text-[#5C7A52] md:h-8 md:w-8 [&_svg]:h-full [&_svg]:w-full">
                    <ServiceOrganicIcon slug={slug} className="!text-[#5C7A52]" />
                  </div>
                </div>
                <h3 className="relative mb-2 font-serif text-[18px] text-brown-deep md:text-[20px]">
                  {copy.title}
                </h3>
                <p className="relative mb-4 text-[14px] leading-[1.6] text-[#7A6050] md:text-[13px] md:leading-[1.7]">
                  {copy.description}
                </p>
                <Link
                  href={`/services/${slug}`}
                  className="relative inline-flex items-center gap-1 text-[13px] font-medium text-[#8B3A1E] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#6B2C14]"
                >
                  {detailCta}
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
