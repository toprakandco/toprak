import { Link } from '@/i18n/navigation';
import type { ComponentProps, ReactNode } from 'react';

type ButtonProps = Omit<ComponentProps<'button'>, 'className'> & {
  href?: string;
  className?: string;
  variant?: 'primary' | 'ghost';
  children: ReactNode;
};

const base =
  'inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold';

const variants = {
  primary:
    'bg-gold text-navy hover:bg-gold-light border border-transparent',
  ghost:
    'border border-navy-light bg-transparent text-navy hover:bg-beige',
} as const;

export function Button({
  href,
  className = '',
  variant = 'primary',
  children,
  ...props
}: ButtonProps) {
  const styles = `${base} ${variants[variant]} ${className}`.trim();

  if (href?.startsWith('mailto:') || href?.startsWith('http')) {
    return (
      <a href={href} className={styles}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={styles} {...props}>
      {children}
    </button>
  );
}
