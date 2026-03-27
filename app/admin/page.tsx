import { createSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';

async function markContactRead(formData: FormData) {
  'use server';
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const db = createSupabaseClient();
  await db.from('contacts').update({ is_read: true }).eq('id', id);
  revalidatePath('/admin');
}

async function getCount(table: 'portfolio_items' | 'blog_posts' | 'contacts' | 'services', filter?: [string, unknown]) {
  const db = createSupabaseClient();
  let query = db.from(table).select('*', { count: 'exact', head: true });
  if (filter) query = query.eq(filter[0], filter[1]);
  const { count } = await query;
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const db = createSupabaseClient();
  const [portfolioCount, publishedBlogCount, unreadContactsCount, servicesCount, recentContacts] =
    await Promise.all([
      getCount('portfolio_items'),
      getCount('blog_posts', ['is_published', true]),
      getCount('contacts', ['is_read', false]),
      getCount('services'),
      db.from('contacts').select('*').order('created_at', { ascending: false }).limit(5),
    ]);

  const contacts = recentContacts.data ?? [];

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-brown-deep">Genel Bakış</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Portfolyo Öğesi', portfolioCount],
          ['Yayındaki Blog', publishedBlogCount],
          ['Okunmamış Mesaj', unreadContactsCount],
          ['Hizmet Sayısı', servicesCount],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-xl border border-beige bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
          >
            <p className="text-sm text-brown-deep/65">{label}</p>
            <p className="mt-2 font-serif text-4xl text-terracotta">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-beige bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
        <h2 className="font-serif text-2xl text-brown-deep">Son Mesajlar</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-beige text-brown-deep/70">
                <th className="px-3 py-2 font-medium">İsim</th>
                <th className="px-3 py-2 font-medium">Email</th>
                <th className="px-3 py-2 font-medium">Konu</th>
                <th className="px-3 py-2 font-medium">Tarih</th>
                <th className="px-3 py-2 font-medium">Okundu mu?</th>
                <th className="px-3 py-2 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, idx) => (
                <tr key={contact.id} className={idx % 2 === 0 ? 'bg-[#FCFBF8]' : 'bg-white'}>
                  <td className="px-3 py-2">{contact.name}</td>
                  <td className="px-3 py-2">{contact.email}</td>
                  <td className="px-3 py-2">{contact.subject || '-'}</td>
                  <td className="px-3 py-2">
                    {new Date(contact.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-3 py-2">{contact.is_read ? 'Evet' : 'Hayır'}</td>
                  <td className="px-3 py-2">
                    {!contact.is_read ? (
                      <form action={markContactRead}>
                        <input type="hidden" name="id" value={contact.id} />
                        <button
                          type="submit"
                          className="rounded-md border border-beige px-2 py-1 text-xs transition hover:bg-beige"
                        >
                          Okundu İşaretle
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-brown-deep/50">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-beige bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
        <h2 className="font-serif text-2xl text-brown-deep">Hızlı Geçiş</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {[
            ['/admin/portfolio', 'Portfolyo'],
            ['/admin/blog', 'Blog'],
            ['/admin/clients', 'Müşteriler'],
            ['/admin/contacts', 'Mesajlar'],
            ['/admin/settings', 'Ayarlar'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="inline-flex min-h-[44px] items-center rounded-lg border border-beige bg-[#FCFBF8] px-4 text-sm transition hover:border-terracotta hover:text-terracotta"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
