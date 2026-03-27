import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

async function createClientAction(formData: FormData) {
  'use server';
  const db = createSupabaseClient();
  await db.from('clients').insert({
    name: String(formData.get('name') ?? ''),
    logo_url: String(formData.get('logo_url') ?? '') || null,
    website_url: String(formData.get('website_url') ?? '') || null,
    order_index: Number(formData.get('order_index') ?? 0),
    is_active: true,
  });
  revalidatePath('/admin/clients');
}

async function toggleClientAction(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  const value = formData.get('value') === 'true';
  if (!id) return;
  const db = createSupabaseClient();
  await db.from('clients').update({ is_active: value }).eq('id', id);
  revalidatePath('/admin/clients');
}

async function deleteClientAction(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const db = createSupabaseClient();
  await db.from('clients').delete().eq('id', id);
  revalidatePath('/admin/clients');
}

export default async function AdminClientsPage() {
  const db = createSupabaseClient();
  const { data } = await db.from('clients').select('*').order('order_index', { ascending: true });
  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-brown-deep">Müşteri Logoları</h1>

      <form action={createClientAction} className="grid grid-cols-1 gap-4 rounded-xl border border-beige bg-white p-5 shadow-sm md:grid-cols-4">
        <input name="name" required placeholder="Name" className="h-11 rounded-lg border border-beige px-3 text-sm" />
        <input name="logo_url" placeholder="Logo URL" className="h-11 rounded-lg border border-beige px-3 text-sm" />
        <input name="website_url" placeholder="Website URL" className="h-11 rounded-lg border border-beige px-3 text-sm" />
        <div className="flex gap-2">
          <input
            name="order_index"
            type="number"
            defaultValue={0}
            className="h-11 w-24 rounded-lg border border-beige px-3 text-sm"
          />
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center rounded-lg bg-terracotta px-4 text-sm text-cream transition hover:bg-terracotta-dark"
          >
            Ekle
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-beige bg-white shadow-sm">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-[#F7F3EC] text-brown-deep/75">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Logo</th>
              <th className="px-3 py-2">Website</th>
              <th className="px-3 py-2">Active</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className={i % 2 ? 'bg-[#FCFBF8]' : 'bg-white'}>
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2">
                  {row.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.logo_url} alt={row.name} className="h-8 w-auto rounded" />
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-3 py-2">{row.website_url || '-'}</td>
                <td className="px-3 py-2">
                  <form action={toggleClientAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <input type="hidden" name="value" value={String(!row.is_active)} />
                    <input
                      type="checkbox"
                      checked={Boolean(row.is_active)}
                      onChange={(e) => e.currentTarget.form?.requestSubmit()}
                    />
                  </form>
                </td>
                <td className="px-3 py-2">
                  <form action={deleteClientAction}>
                    <input type="hidden" name="id" value={row.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                    >
                      Sil
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
