create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  username text unique not null,
  password text not null,
  is_active boolean not null default true
);

insert into public.admin_users (username, password, is_active)
values
  ('ece', 'Eceeymen8803!', true),
  ('eymen', 'Eceeymen8803!', true)
on conflict (username) do update
set
  password = excluded.password,
  is_active = excluded.is_active;
