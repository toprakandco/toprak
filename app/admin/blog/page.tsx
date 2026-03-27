import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

async function togglePublished(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  const value = formData.get('value') === 'true';
  if (!id) return;
  const db = createSupabaseClient();
  await db.from('blog_posts').update({ is_published: value }).eq('id', id);
  revalidatePath('/admin/blog');
}

async function deletePost(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const db = createSupabaseClient();
  await db.from('blog_posts').delete().eq('id', id);
  revalidatePath('/admin/blog');
}

export default async function AdminBlogPage() {
  const db = createSupabaseClient();
  const { data } = await db.from('blog_posts').select('*').order('published_at', { ascending: false });
  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-brown-deep">Blog Yönetimi</h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex min-h-[44px] items-center rounded-lg bg-terracotta px-4 text-sm text-cream transition hover:bg-terracotta-dark"
        >
          Yeni Yazı
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-beige bg-white shadow-sm">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-[#F7F3EC] text-brown-deep/75">
            <tr>
              <th className="px-3 py-2">Başlık</th>
              <th className="px-3 py-2">Yayın Tarihi</th>
              <th className="px-3 py-2">Yayınlandı mı</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className={i % 2 ? 'bg-[#FCFBF8]' : 'bg-white'}>
                <td className="px-3 py-2">{row.title_tr}</td>
                <td className="px-3 py-2">
                  {row.published_at ? new Date(row.published_at).toLocaleDateString('tr-TR') : '-'}
                </td>
                <td className="px-3 py-2">
                  <form action={togglePublished}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="value" value={String(!row.is_published)} />
                    <input
                      type="checkbox"
                      checked={Boolean(row.is_published)}
                      onChange={(e) => e.currentTarget.form?.requestSubmit()}
                    />
                  </form>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/blog/edit/${row.id}`}
                      className="rounded-md border border-beige px-2 py-1 text-xs hover:bg-beige"
                    >
                      Düzenle
                    </Link>
                    <form action={deletePost}>
                      <input type="hidden" name="id" value={row.id} />
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
