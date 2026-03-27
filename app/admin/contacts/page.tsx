import { createSupabaseClient } from '@/lib/supabase';
import { ContactsListClient } from './ContactsListClient';

type Filter = 'all' | 'unread' | 'read';

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function AdminContactsPage({ searchParams }: Props) {
  const { filter: raw } = await searchParams;
  const filter: Filter =
    raw === 'unread' ? 'unread' : raw === 'read' ? 'read' : 'all';

  const db = createSupabaseClient();

  const unreadQuery = db
    .from('contacts')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);
  const { count: unreadCount } = await unreadQuery;

  let listQuery = db.from('contacts').select('*').order('created_at', { ascending: false });
  if (filter === 'unread') {
    listQuery = listQuery.eq('is_read', false);
  } else if (filter === 'read') {
    listQuery = listQuery.eq('is_read', true);
  }

  const { data } = await listQuery;
  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-brown-deep">İletişim Mesajları</h1>
      <ContactsListClient
        contacts={rows}
        filter={filter}
        unreadCount={unreadCount ?? 0}
      />
    </div>
  );
}
