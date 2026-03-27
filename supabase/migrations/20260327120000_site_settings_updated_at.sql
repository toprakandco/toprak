-- Optional updated_at for site_settings (upserted from admin)
alter table public.site_settings
  add column if not exists updated_at timestamptz default now();

update public.site_settings set updated_at = now() where updated_at is null;

create or replace function public.set_site_settings_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_site_settings_updated_at();
