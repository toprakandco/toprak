import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

async function markReadAction(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const db = createSupabaseClient();
  await db.from('contacts').update({ is_read: true }).eq('id', id);
  revalidatePath('/admin/contacts');
}

async function deleteAction(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const db = createSupabaseClient();
  await db.from('contacts').delete().eq('id', id);
  revalidatePath('/admin/contacts');
}

export default async function AdminContactsPage({ searchParams }: Props) {
  const { filter } = await searchParams;
  const unreadOnly = filter === 'unread';
  const db = createSupabaseClient();

  let query = db.from('contacts').select('*').order('created_at', { ascending: false });
  if (unreadOnly) {
    query = query.eq('is_read', false);
  }
  const { data } = await query;
  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl text-brown-deep">İletişim Mesajları</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/contacts?filter=unread"
            className={`rounded-lg border px-3 py-2 text-sm ${unreadOnly ? 'border-terracotta bg-terracotta text-cream' : 'border-beige bg-white'}`}
          >
            Okunmadı
          </Link>
          <Link
            href="/admin/contacts"
            className={`rounded-lg border px-3 py-2 text-sm ${!unreadOnly ? 'border-terracotta bg-terracotta text-cream' : 'border-beige bg-white'}`}
          >
            Tümü
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-beige bg-white shadow-sm">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-[#F7F3EC] text-brown-deep/75">
            <tr>
              <th className="px-3 py-2">Tarih</th>
              <th className="px-3 py-2">İsim</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Telefon</th>
              <th className="px-3 py-2">Konu</th>
              <th className="px-3 py-2">Mesaj</th>
              <th className="px-3 py-2">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className={i % 2 ? 'bg-[#FCFBF8]' : 'bg-white'}>
                <td className="px-3 py-2">{new Date(row.created_at).toLocaleDateString('tr-TR')}</td>
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2">{row.email}</td>
                <td className="px-3 py-2">{row.phone || '-'}</td>
                <td className="px-3 py-2">{row.subject || '-'}</td>
                <td className="px-3 py-2">
                  <details>
                    <summary className="cursor-pointer text-brown-deep/80">
                      {row.message.slice(0, 50)}
                      {row.message.length > 50 ? '…' : ''}
                    </summary>
                    <p className="mt-2 whitespace-pre-wrap text-xs text-brown-deep/70">{row.message}</p>
                  </details>
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    {!row.is_read ? (
                      <form action={markReadAction}>
                        <input type="hidden" name="id" value={row.id} />
                        <button
                          type="submit"
                          className="rounded-md border border-beige px-2 py-1 text-xs hover:bg-beige"
                        >
                          Okundu
                        </button>
                      </form>
                    ) : null}
                    <form action={deleteAction}>
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
