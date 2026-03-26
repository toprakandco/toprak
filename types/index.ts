export type { ServiceSlug } from '@/lib/service-slugs';

export type AppLocale = 'tr' | 'en';

export type PortfolioSlug = string;

export type BlogSlug = string;

export interface LocalizedSlugPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export interface Contact {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
}

export interface Service {
  id: string;
  created_at: string;
  slug: string;
  title_tr: string;
  title_en: string;
  description_tr: string | null;
  description_en: string | null;
  icon: string | null;
  tags: string[] | null;
  order_index: number;
  is_active: boolean;
}

export interface PortfolioItem {
  id: string;
  created_at: string;
  slug: string;
  title_tr: string;
  title_en: string;
  description_tr: string | null;
  description_en: string | null;
  category: string | null;
  cover_image: string | null;
  images: string[];
  tags: string[];
  is_featured: boolean;
  is_active: boolean;
  order_index: number;
}

export interface BlogPost {
  id: string;
  created_at: string;
  slug: string;
  title_tr: string;
  title_en: string;
  content_tr: string;
  content_en: string;
  excerpt_tr: string | null;
  excerpt_en: string | null;
  cover_image: string | null;
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}
