-- Proje başvuru formu (çok adımlı /start)
create table if not exists public.project_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  services text[] not null default '{}',
  budget text not null,
  timeline text not null,
  description text not null,
  reference_url text,
  name text not null,
  email text not null,
  phone text,
  company text,
  contact_preference text not null,
  is_read boolean not null default false
);

create index if not exists project_applications_created_at_idx
  on public.project_applications (created_at desc);

create index if not exists project_applications_is_read_idx
  on public.project_applications (is_read);

comment on table public.project_applications is 'Multi-step project inquiry from /start';
