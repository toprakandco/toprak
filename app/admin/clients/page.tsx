import { createSupabaseClient } from '@/lib/supabase';
import { ClientsListClient } from './ClientsListClient';

export default async function AdminClientsPage() {
  const db = createSupabaseClient();
  const { data } = await db
    .from('clients')
    .select('*')
    .order('order_index', { ascending: true });
  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-brown-deep">Müşteri Logoları</h1>
      <ClientsListClient clients={rows} />
    </div>
  );
}
