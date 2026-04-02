import type {
  AdminUser,
  BlogPost,
  CallbackRequest,
  Client,
  Contact,
  NewsletterSubscriber,
  PortfolioItem,
  ProjectApplication,
  Service,
  SiteSetting,
  Testimonial,
} from '@/types';

/** Supabase `Database` shape — lives in its own file so client bundles never pull `lib/supabase` via type-only chains. */
export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: Contact;
      };
      services: {
        Row: Service;
      };
      portfolio_items: {
        Row: PortfolioItem;
      };
      blog_posts: {
        Row: BlogPost;
      };
      clients: {
        Row: Client;
      };
      site_settings: {
        Row: SiteSetting;
      };
      admin_users: {
        Row: AdminUser;
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriber;
      };
      project_applications: {
        Row: ProjectApplication;
      };
      callback_requests: {
        Row: CallbackRequest;
      };
      testimonials: {
        Row: Testimonial;
      };
    };
  };
}
