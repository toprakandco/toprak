'use client';

import '../globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { getAdminPageTitle } from './admin-page-title';

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  badgeCount?: number;
};

type Props = {
  children: ReactNode;
  unreadContacts: number;
  unreadApplications: number;
  /** Giriş yapan yönetici (eymen / ece); sunucu çerezinden doğrulanır. */
  adminDisplay?: string | null;
};

function navActive(pathname: string, href: string) {
  if (href === '/admin') {
    return pathname === '/admin' || pathname === '/admin/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  children,
  unreadContacts,
  unreadApplications,
  adminDisplay,
}: Props) {
  const pathname = usePathname() ?? '';

  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return <>{children}</>;
  }

  const title = getAdminPageTitle(pathname);

  const items: NavItem[] = [
    {
      href: '/admin',
      label: 'Genel Bakış',
      icon: <IconOverview />,
    },
    {
      href: '/admin/portfolio',
      label: 'Portfolyo',
      icon: <IconPortfolio />,
    },
    {
      href: '/admin/blog',
      label: 'Blog',
      icon: <IconBlog />,
    },
    {
      href: '/admin/clients',
      label: 'Müşteriler',
      icon: <IconClients />,
    },
    {
      href: '/admin/contacts',
      label: 'Mesajlar',
      icon: <IconMessages />,
      badgeCount: unreadContacts,
    },
    {
      href: '/admin/applications',
      label: 'Başvurular',
      icon: <IconApplications />,
      badgeCount: unreadApplications,
    },
    {
      href: '/admin/settings',
      label: 'Ayarlar',
      icon: <IconSettings />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F4] font-sans text-[#3D1F10] antialiased">
      <aside className="fixed inset-y-0 left-0 z-20 flex h-screen w-[240px] flex-col bg-[#1C1410] pt-8 text-[#F5F0E6]">
        <div className="mb-6 border-b-[0.5px] border-white/[0.08] px-5 pb-6">
          <p className="font-serif text-[20px] leading-tight text-[#F5F0E6]">T&amp;Co.</p>
          <p className="mt-1 font-sans text-[11px] text-[#F5F0E6]/40">Yönetim</p>
          {adminDisplay ? (
            <p className="mt-2 font-sans text-[12px] font-medium text-[#F5F0E6]/85">
              {adminDisplay}
            </p>
          ) : null}
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {items.map((item) => {
            const active = navActive(pathname, item.href);
            const badgeN = item.badgeCount ?? 0;
            const showBadge = badgeN > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 rounded-lg py-2.5 pl-5 pr-5 font-sans text-[14px] transition-colors ${
                  active
                    ? 'border-l-[3px] border-l-[#8B3A1E] bg-[#8B3A1E]/30 pl-[17px] text-[#F5F0E6]'
                    : 'border-l-[3px] border-l-transparent pl-[17px] text-[#F5F0E6]/70 hover:bg-white/[0.05]'
                }`}
              >
                <span className="shrink-0 text-current [&>svg]:block">{item.icon}</span>
                <span className="min-w-0 flex-1">{item.label}</span>
                {showBadge ? (
                  <span className="flex shrink-0 items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden />
                    <span className="font-sans text-[11px] font-medium tabular-nums text-[#F5F0E6]/80">
                      {badgeN > 99 ? '99+' : badgeN}
                    </span>
                  </span>
                ) : null}
              </Link>
            );
          })}

          <div className="my-4 h-px shrink-0 bg-white/[0.08]" aria-hidden />

          <button
            type="button"
            onClick={() => {
              window.location.href = '/api/admin/logout';
            }}
            className="flex w-full items-center gap-3 rounded-lg border-l-[3px] border-l-transparent py-2.5 pl-[17px] pr-5 text-left font-sans text-[14px] text-[#F5F0E6]/70 transition-colors hover:bg-white/[0.05]"
          >
            <span className="shrink-0 [&>svg]:block">
              <IconLogout />
            </span>
            Çıkış
          </button>
        </nav>
      </aside>

      <div className="ml-[240px] min-h-screen">
        <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b-[0.5px] border-[#EDE4D3] bg-white px-8">
          <h1 className="font-sans text-[15px] font-semibold text-[#3D1F10]">{title}</h1>
          <a
            href="https://toprakco.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-[#8B3A1E] transition hover:text-[#6B2C14]"
          >
            Siteyi Gör ↗
          </a>
        </header>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}

function IconOverview() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconPortfolio() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3 16l5-5 4 4 4-4 5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconBlog() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClients() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 21V10M4 10V7l8-4 8 4v3M4 10l8 4M12 14l8-4M12 14v7M12 14L4 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMessages() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16v10H8l-4 4V6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconApplications() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2v2m0 18v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m18 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
