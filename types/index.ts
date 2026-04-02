export type { ServiceSlug } from '@/lib/service-slugs';

export type AppLocale = 'tr' | 'en' | 'de' | 'fr';

export type PortfolioSlug = string;

export type BlogSlug = string;

export interface LocalizedSlugPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export interface Testimonial {
  id: string;
  created_at: string;
  client_name: string;
  client_title: string | null;
  client_company: string | null;
  content_tr: string;
  content_en: string | null;
  content_de: string | null;
  content_fr: string | null;
  rating: number;
  is_active: boolean;
  order_index: number;
}

export interface Contact {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  budget: string | null;
  is_read: boolean;
}

export interface Service {
  id: string;
  created_at: string;
  slug: string;
  title_tr: string;
  title_en: string;
  title_de?: string | null;
  title_fr?: string | null;
  description_tr: string | null;
  description_en: string | null;
  description_de?: string | null;
  description_fr?: string | null;
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
  title_de?: string | null;
  title_fr?: string | null;
  description_tr: string | null;
  description_en: string | null;
  description_de?: string | null;
  description_fr?: string | null;
  category: string | null;
  cover_image: string | null;
  before_image: string | null;
  after_image: string | null;
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
  title_de?: string | null;
  title_fr?: string | null;
  content_tr: string;
  content_en: string;
  content_de?: string | null;
  content_fr?: string | null;
  excerpt_tr: string | null;
  excerpt_en: string | null;
  excerpt_de?: string | null;
  excerpt_fr?: string | null;
  cover_image: string | null;
  tags: string[];
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
}

export interface Client {
  id: string;
  created_at: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  order_index: number;
  is_active: boolean;
}

export interface SiteSetting {
  key: string;
  value: string;
  updated_at?: string | null;
}

export interface AdminUser {
  id: string;
  created_at: string;
  username: string;
  password: string;
  is_active: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  created_at: string;
  email: string;
  is_active: boolean;
}

export interface CallbackRequest {
  id: string;
  created_at: string;
  phone: string;
  preferred_time: string;
  is_called: boolean;
}

export interface ProjectApplication {
  id: string;
  created_at: string;
  services: string[];
  budget: string;
  timeline: string;
  description: string;
  reference_url: string | null;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  contact_preference: string;
  is_read: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  budget?: string;
}
