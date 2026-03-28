alter table public.portfolio_items
  add column if not exists before_image text,
  add column if not exists after_image text;
