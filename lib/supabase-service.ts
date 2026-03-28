import { createClient } from '@supabase/supabase-js';
import { createSupabaseClient } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

/**
 * Service role client — sunucu tarafında (API, server actions) kullanın.
 * SUPABASE_SERVICE_ROLE_KEY yoksa anon istemciye düşer (lokal geliştirme).
 */
export function createServiceSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return createSupabaseClient();
  }
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
