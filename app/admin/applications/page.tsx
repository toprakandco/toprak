import { createServiceSupabaseClient } from '@/lib/supabase-service';
import type { ProjectApplication } from '@/types';
import { ApplicationsListClient } from './ApplicationsListClient';

type Filter = 'all' | 'unread' | 'read';

type Props = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function AdminApplicationsPage({ searchParams }: Props) {
  const { filter: raw } = await searchParams;
  const filter: Filter =
    raw === 'unread' ? 'unread' : raw === 'read' ? 'read' : 'all';

  const db = createServiceSupabaseClient();

  const unreadQuery = db
    .from('project_applications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);
  const { count: unreadCount } = await unreadQuery;

  let listQuery = db
    .from('project_applications')
    .select('*')
    .order('created_at', { ascending: false });
  if (filter === 'unread') {
    listQuery = listQuery.eq('is_read', false);
  } else if (filter === 'read') {
    listQuery = listQuery.eq('is_read', true);
  }

  const { data } = await listQuery;
  const rows = (data ?? []) as ProjectApplication[];

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-brown-deep">Proje Başvuruları</h1>
      <ApplicationsListClient
        rows={rows}
        filter={filter}
        unreadCount={unreadCount ?? 0}
      />
    </div>
  );
}
