import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

async function toggleField(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  const field = String(formData.get('field') ?? '') as 'is_featured' | 'is_active';
  const value = formData.get('value') === 'true';
  if (!id || !['is_featured', 'is_active'].includes(field)) return;
  const db = createSupabaseClient();
  await db.from('portfolio_items').update({ [field]: value }).eq('id', id);
  revalidatePath('/admin/portfolio');
}

async function deleteItem(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const db = createSupabaseClient();
  await db.from('portfolio_items').delete().eq('id', id);
  revalidatePath('/admin/portfolio');
}

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
        <h1 className="font-serif text-3xl text-brown-deep">Portfolyo Yönetimi</h1>
        <Link
          href="/admin/portfolio/new"
          className="inline-flex min-h-[44px] items-center rounded-lg bg-terracotta px-4 text-sm text-cream transition hover:bg-terracotta-dark"
        >
          Yeni Ekle
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-beige bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-[#F7F3EC] text-brown-deep/75">
            <tr>
              <th className="px-3 py-2">Başlık</th>
              <th className="px-3 py-2">Kategori</th>
              <th className="px-3 py-2">Featured</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, i) => (
              <tr key={item.id} className={i % 2 ? 'bg-[#FCFBF8]' : 'bg-white'}>
                <td className="px-3 py-2">{item.title_tr}</td>
                <td className="px-3 py-2">{item.category || '-'}</td>
                <td className="px-3 py-2">
                  <form action={toggleField}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="field" value="is_featured" />
                    <input type="hidden" name="value" value={String(!item.is_featured)} />
                    <input
                      type="checkbox"
                      checked={Boolean(item.is_featured)}
                      onChange={(e) => e.currentTarget.form?.requestSubmit()}
                    />
                  </form>
                </td>
                <td className="px-3 py-2">
                  <form action={toggleField}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="field" value="is_active" />
                    <input type="hidden" name="value" value={String(!item.is_active)} />
                    <input
                      type="checkbox"
                      checked={Boolean(item.is_active)}
                      onChange={(e) => e.currentTarget.form?.requestSubmit()}
                    />
                  </form>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/portfolio/edit/${item.id}`}
                      className="rounded-md border border-beige px-2 py-1 text-xs hover:bg-beige"
                    >
                      Düzenle
                    </Link>
                    <form action={deleteItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        Sil
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
