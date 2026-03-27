-- Public newsletter signups from blog (anon insert via RLS).
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  is_active boolean not null default true
);

create unique index if not exists newsletter_subscribers_email_key
  on public.newsletter_subscribers (lower(email));

alter table public.newsletter_subscribers enable row level security;

-- Allow anonymous inserts from the site; no public read/update.
create policy "newsletter_subscribers_insert_anon"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);
