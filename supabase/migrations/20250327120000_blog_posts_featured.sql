-- Optional: run in Supabase SQL editor if `is_featured` is not yet on `blog_posts`.
alter table public.blog_posts
  add column if not exists is_featured boolean default false;

create unique index if not exists blog_posts_slug_key on public.blog_posts (slug);
