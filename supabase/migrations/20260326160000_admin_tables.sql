create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  logo_url text,
  website_url text,
  order_index integer not null default 0,
  is_active boolean not null default true
);

create index if not exists clients_order_idx on public.clients (order_index);

create table if not exists public.site_settings (
  key text primary key,
  value text not null default ''
);
