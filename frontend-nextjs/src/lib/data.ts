// Typed data-access functions for Server Components. Thin wrappers over apiGet/apiList/apiOne.
import { apiList, apiOne, isBackendReachable } from "./api";

export { isBackendReachable };

import type {
  BlogCategory,
  BlogPost,
  Category,
  HomeSection,
  PageBackground,
  Product,
  Project,
  SeoSetting,
  Service,
  SiteSettings,
  Testimonial,
} from "./types";

/* ----------------------------------------------------------------- CMS */

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const rows = await apiList<SiteSettings>("/cms/settings/", { revalidate: 600 });
  return rows[0] ?? null;
}

export async function getHomeSections(): Promise<HomeSection[]> {
  const rows = await apiList<HomeSection>("/cms/home-sections/", { revalidate: 300 });
  return rows.filter((s) => s.enabled).sort((a, b) => a.order - b.order);
}

export async function getPageBackground(pageKey: string): Promise<PageBackground | null> {
  const bg = await apiOne<PageBackground>(`/cms/backgrounds/${pageKey}/`, { revalidate: 600 });
  return bg && bg.enabled && bg.is_published ? bg : null;
}

export async function getSeo(path: string): Promise<SeoSetting | null> {
  // SeoSetting lookup_field is `path`, but slashes break the URL — fetch all and match.
  const rows = await apiList<SeoSetting>("/cms/seo/", { revalidate: 600 });
  return rows.find((s) => s.path === path) ?? null;
}

/* ------------------------------------------------------------- catalog */

export async function getServices(params?: { featured?: boolean; category?: string }): Promise<Service[]> {
  return apiList<Service>("/catalog/services/", {
    query: {
      is_published: true,
      is_featured: params?.featured ? true : undefined,
      category: params?.category,
      ordering: "order",
      page_size: 100,
    },
  });
}

export async function getService(slug: string): Promise<Service | null> {
  return apiOne<Service>(`/catalog/services/${slug}/`);
}

export async function getProducts(params?: { featured?: boolean; category?: string; search?: string }): Promise<Product[]> {
  return apiList<Product>("/catalog/products/", {
    query: {
      is_published: true,
      is_featured: params?.featured ? true : undefined,
      category: params?.category,
      search: params?.search,
      ordering: "order",
      page_size: 100,
    },
  });
}

export async function getProduct(slug: string): Promise<Product | null> {
  return apiOne<Product>(`/catalog/products/${slug}/`);
}

export async function getCategories(kind?: "service" | "product"): Promise<Category[]> {
  return apiList<Category>("/catalog/categories/", { query: { kind, page_size: 100 } });
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return apiList<Testimonial>("/catalog/testimonials/", {
    query: { is_published: true, page_size: 50 },
  });
}

/* ----------------------------------------------------------- portfolio */

export async function getProjects(params?: { featured?: boolean; category?: string }): Promise<Project[]> {
  return apiList<Project>("/portfolio/projects/", {
    query: {
      is_published: true,
      is_featured: params?.featured ? true : undefined,
      category: params?.category,
      ordering: "order",
      page_size: 100,
    },
  });
}

export async function getProject(slug: string): Promise<Project | null> {
  return apiOne<Project>(`/portfolio/projects/${slug}/`);
}

/* ---------------------------------------------------------------- blog */

export async function getPosts(params?: { category?: string; search?: string }): Promise<BlogPost[]> {
  return apiList<BlogPost>("/blog/posts/", {
    query: {
      status: "published",
      category: params?.category,
      search: params?.search,
      ordering: "-published_at",
      page_size: 100,
    },
  });
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  return apiOne<BlogPost>(`/blog/posts/${slug}/`);
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  return apiList<BlogCategory>("/blog/categories/", { query: { page_size: 100 } });
}

/* -------------------------------------------------------------- config helpers */

export function sectionByKey(sections: HomeSection[], key: string): HomeSection | undefined {
  return sections.find((s) => s.key === key);
}
