import { createSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';
import { PortfolioListClient } from './PortfolioListClient';

export default async function AdminPortfolioPage() {
  const db = createSupabaseClient();
  const { data } = await db
    .from('portfolio_items')
    .select('*')
    .order('order_index', { ascending: true });

  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-sans text-sm text-[#6B4C35]">
          Tüm portfolyo öğelerini yönetin.
        </p>
        <Link
          href="/admin/portfolio/new"
          className="inline-flex min-h-[44px] items-center rounded-lg bg-[#8B3A1E] px-5 font-sans text-sm font-semibold text-[#F5F0E6] transition hover:bg-[#6B2C14]"
        >
          Yeni Ekle
        </Link>
      </div>

      <PortfolioListClient items={rows} />
    </div>
  );
}
