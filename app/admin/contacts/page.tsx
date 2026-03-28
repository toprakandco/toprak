import { createServiceSupabaseClient } from '@/lib/supabase-service';
import { createSupabaseClient } from '@/lib/supabase';
import type { CallbackRequest } from '@/types';
import { CallbackRequestsListClient } from './CallbackRequestsListClient';
import { ContactsListClient } from './ContactsListClient';
import { ContactsViewTabs } from './ContactsViewTabs';

type Filter = 'all' | 'unread' | 'read';

type Props = {
  searchParams: Promise<{ filter?: string; view?: string }>;
};

export default async function AdminContactsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const view = sp.view === 'callbacks' ? 'callbacks' : 'messages';

  if (view === 'callbacks') {
    const db = createServiceSupabaseClient();
    const { data } = await db
      .from('callback_requests')
      .select('*')
      .order('created_at', { ascending: false });
    const rows = (data ?? []) as CallbackRequest[];

    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl text-brown-deep">İletişim</h1>
        <ContactsViewTabs view="callbacks" />
        <CallbackRequestsListClient rows={rows} />
      </div>
    );
  }

  const filter: Filter =
    sp.filter === 'unread' ? 'unread' : sp.filter === 'read' ? 'read' : 'all';

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
      <h1 className="font-serif text-3xl text-brown-deep">İletişim</h1>
      <ContactsViewTabs view="messages" />
      <ContactsListClient
        contacts={rows}
        filter={filter}
        unreadCount={unreadCount ?? 0}
      />
    </div>
  );
}
