export const SITE_SETTING_KEYS = [
  'site_title_tr',
  'site_title_en',
  'meta_description_tr',
  'meta_description_en',
  'contact_email',
  'instagram_url',
  'youtube_url',
  'linkedin_url',
  'hero_heading_tr',
  'hero_heading_en',
  'hero_subtitle_tr',
  'hero_subtitle_en',
  'clients_section_title',
  'maintenance_mode',
  'maintenance_message_tr',
  'maintenance_message_en',
] as const;

export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[number];
