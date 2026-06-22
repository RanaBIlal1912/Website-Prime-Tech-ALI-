// API response types — mirror the verified DRF serializer shapes at /api/v1/.

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface SiteSettings {
  id: number;
  site_title: string;
  tagline: string;
  logo: string;
  favicon: string;
  footer_text: string;
  company_desc: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  map_embed: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  updated_at: string;
}

export interface SeoSetting {
  id: string;
  path: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: string;
  robots: string;
  structured_data: Record<string, unknown>;
}

export interface CtaConfig {
  label: string;
  href: string;
}

export interface HeroConfig {
  badge?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  primary_cta?: CtaConfig;
  secondary_cta?: CtaConfig;
}

export interface StatItem {
  icon: string;
  value: number;
  suffix: string;
  label: string;
}

export interface IconTextItem {
  icon: string;
  title: string;
  text: string;
}

export interface IndustryItem {
  icon: string;
  name: string;
}

export interface CtaSectionConfig {
  title?: string;
  subtitle?: string;
  primary_cta?: CtaConfig;
}

export interface HomeSection {
  id: string;
  key: string;
  title: string;
  enabled: boolean;
  order: number;
  config: Record<string, unknown>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  kind: "service" | "product";
  description: string;
  featured_image: string;
  banner_image: string;
  background_image: string;
  background_video: string;
  seo_title: string;
  seo_description: string;
  order: number;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  icon: string;
  short_desc: string;
  description: string;
  benefits: string[];
  faqs: Faq[];
  category: string | null;
  category_name: string | null;
  featured_image: string;
  banner_image: string;
  background_image: string;
  background_video: string;
  gallery: string[];
  seo_title: string;
  seo_description: string;
  is_published: boolean;
  is_featured: boolean;
  order: number;
}

export interface Spec {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  category_name: string | null;
  price: string | null;
  price_label: string;
  badge: string;
  description: string;
  specs: Spec[];
  featured_image: string;
  gallery: string[];
  video: string;
  is_published: boolean;
  is_featured: boolean;
  stock_status: "in_stock" | "out" | "order";
  order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  client_name: string;
  location: string;
  completion_date: string | null;
  category: string;
  featured_image: string;
  gallery: string[];
  videos: string[];
  before_image: string;
  after_image: string;
  background_image: string;
  background_video: string;
  is_published: boolean;
  is_featured: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  kind: "text" | "video";
  body: string;
  video: string;
  rating: number;
  is_published: boolean;
  order: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string | null;
  category_name: string | null;
  tags: string[];
  author: string | null;
  author_name: string | null;
  status: "draft" | "published";
  published_at: string | null;
  seo_title: string;
  seo_description: string;
  keywords: string;
  created_at: string;
  updated_at: string;
}

export interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service_interest?: string;
  message?: string;
  city?: string;
}

export interface LeadResponse {
  success: boolean;
  message: string;
}
