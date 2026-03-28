-- Row level security: anon/public may insert (forms); reads via service role only.

alter table if exists public.project_applications enable row level security;
alter table if exists public.callback_requests enable row level security;

drop policy if exists "Insert only" on public.project_applications;
create policy "Insert only" on public.project_applications
  for insert
  with check (true);

drop policy if exists "Service role read" on public.project_applications;
create policy "Service role read" on public.project_applications
  for select
  using (false);

drop policy if exists "Insert only" on public.callback_requests;
create policy "Insert only" on public.callback_requests
  for insert
  with check (true);

drop policy if exists "Service role read" on public.callback_requests;
create policy "Service role read" on public.callback_requests
  for select
  using (false);
