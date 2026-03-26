-- Optional: run in Supabase SQL editor if `tags` is not yet on `services`.
alter table public.services
  add column if not exists tags text[] default '{}';

create unique index if not exists services_slug_key on public.services (slug);
