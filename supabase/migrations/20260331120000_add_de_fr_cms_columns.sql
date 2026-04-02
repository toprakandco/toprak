-- DE / FR localized fields (nullable; fallback to EN in app when null)
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS title_de text,
  ADD COLUMN IF NOT EXISTS title_fr text,
  ADD COLUMN IF NOT EXISTS description_de text,
  ADD COLUMN IF NOT EXISTS description_fr text;

ALTER TABLE portfolio_items
  ADD COLUMN IF NOT EXISTS title_de text,
  ADD COLUMN IF NOT EXISTS title_fr text,
  ADD COLUMN IF NOT EXISTS description_de text,
  ADD COLUMN IF NOT EXISTS description_fr text;

ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS title_de text,
  ADD COLUMN IF NOT EXISTS title_fr text,
  ADD COLUMN IF NOT EXISTS content_de text,
  ADD COLUMN IF NOT EXISTS content_fr text,
  ADD COLUMN IF NOT EXISTS excerpt_de text,
  ADD COLUMN IF NOT EXISTS excerpt_fr text;
