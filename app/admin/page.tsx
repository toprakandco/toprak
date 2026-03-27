import { createSupabaseClient } from '@/lib/supabase';
import type { Contact } from '@/types';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { DashboardRecentContacts } from './DashboardRecentContacts';

async function markContactRead(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const db = createSupabaseClient();
  await db.from('contacts').update({ is_read: true }).eq('id', id);
  revalidatePath('/admin');
  revalidatePath('/admin/contacts');
}

export default async function AdminDashboardPage() {
  const db = createSupabaseClient();

  const [portfolioRes, blogRes, unreadRes, clientsRes, recentRes] =
    await Promise.all([
      db
        .from('portfolio_items')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true),
      db
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true),
      db
        .from('contacts')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false),
      db
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true),
      db
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

  const portfolioCount = portfolioRes.count ?? 0;
  const blogCount = blogRes.count ?? 0;
  const unreadCount = unreadRes.count ?? 0;
  const clientsCount = clientsRes.count ?? 0;
  const recentContacts = (recentRes.data ?? []) as Contact[];

  const stats = [
    {
      label: 'Aktif portfolyo',
      value: portfolioCount,
      icon: <StatIconPortfolio />,
    },
    {
      label: 'Yayındaki blog yazısı',
      value: blogCount,
      icon: <StatIconBlog />,
    },
    {
      label: 'Okunmamış mesaj',
      value: unreadCount,
      icon: <StatIconInbox />,
    },
    {
      label: 'Aktif müşteri',
      value: clientsCount,
      icon: <StatIconClients />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="relative rounded-[12px] bg-white py-5 px-6"
          >
            <div className="absolute right-6 top-5 text-[#8B3A1E]/70 [&>svg]:block">
              {s.icon}
            </div>
            <p className="pr-10 font-sans text-[13px] text-[#6B4C35]">{s.label}</p>
            <p
              className="mt-1 font-serif leading-tight text-[#8B3A1E]"
              style={{ fontSize: '36px' }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-3 font-sans text-[15px] font-semibold text-[#3D1F10]">
          Son mesajlar
        </h2>
        <DashboardRecentContacts
          contacts={recentContacts}
          markReadAction={markContactRead}
        />
      </section>

      <section>
        <h2 className="mb-3 font-sans text-[15px] font-semibold text-[#3D1F10]">
          Hızlı işlemler
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/portfolio/new"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#8B3A1E] px-5 font-sans text-sm font-semibold text-[#F5F0E6] transition hover:bg-[#6B2C14]"
          >
            Yeni Portfolyo Ekle
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#8B3A1E] px-5 font-sans text-sm font-semibold text-[#F5F0E6] transition hover:bg-[#6B2C14]"
          >
            Yeni Blog Yazısı
          </Link>
          <Link
            href="/admin/contacts"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#EDE4D3] bg-white px-5 font-sans text-sm font-semibold text-[#8B3A1E] transition hover:border-[#8B3A1E]/30 hover:bg-[#F5F0E6]"
          >
            Mesajları Gör
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatIconPortfolio() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" />
      <path
        d="M3 17l6-6 4 4 5-5 5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatIconBlog() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StatIconInbox() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16v10H8l-4 4V6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M4 9l8 5 8-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatIconClients() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
