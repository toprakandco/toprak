'use client';

import '../globals.css';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type Props = {
  children: ReactNode;
};

const navItems = [
  { href: '/admin', label: '📊 Genel Bakış' },
  { href: '/admin/portfolio', label: '🖼️ Portfolyo' },
  { href: '/admin/blog', label: '✍️ Blog Yazıları' },
  { href: '/admin/clients', label: '🏢 Müşteriler' },
  { href: '/admin/contacts', label: '📨 Mesajlar' },
  { href: '/admin/settings', label: '⚙️ Site Ayarları' },
];

export default function AdminLayout({ children }: Props) {
  const pathname = usePathname();
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-brown-deep">
      <aside className="fixed inset-y-0 left-0 w-[240px] bg-brown-deep p-5 text-cream">
        <div className="mb-8 border-b border-cream/20 pb-5">
          <Image
            src="/photos/LOGO.png"
            alt="Toprak & Co."
            width={160}
            height={40}
            className="h-10 w-auto object-contain object-left"
          />
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-cream/90 transition hover:bg-terracotta hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin/logout"
            className="mt-6 block rounded-lg px-3 py-2 text-sm text-cream/90 transition hover:bg-terracotta hover:text-cream"
          >
            🚪 Çıkış
          </Link>
        </nav>
      </aside>

      <main className="ml-[240px] min-h-screen p-8">{children}</main>
    </div>
  );
}
