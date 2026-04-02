-- Testimonials (public site). Anon may read active rows only; mutations use service role (bypasses RLS).

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_name text not null,
  client_title text,
  client_company text,
  content_tr text not null,
  content_en text,
  content_de text,
  content_fr text,
  rating integer not null default 5 check (rating >= 1 and rating <= 5),
  is_active boolean not null default true,
  order_index integer not null default 0
);

alter table public.testimonials enable row level security;

drop policy if exists "Public read testimonials" on public.testimonials;
create policy "Public read testimonials"
  on public.testimonials for select
  using (is_active = true);

drop policy if exists "Service role manage" on public.testimonials;
create policy "Service role manage"
  on public.testimonials for all
  using (false);
