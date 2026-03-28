-- Geri arama talepleri (iletişim sayfası widget)
create table if not exists public.callback_requests (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  preferred_time text not null,
  created_at timestamptz not null default now(),
  is_called boolean not null default false
);

create index if not exists callback_requests_created_at_idx
  on public.callback_requests (created_at desc);

comment on table public.callback_requests is 'Sizi arayalım — telefon + uygun zaman';
