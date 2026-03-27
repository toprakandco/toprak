alter table public.contacts
  add column if not exists budget text;

comment on column public.contacts.budget is 'Optional budget range from contact form (slug e.g. lt-5k, 5-15k).';
