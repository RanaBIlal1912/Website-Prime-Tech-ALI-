// Structured-data (schema.org) builders for rich results & local SEO.
import type { BlogPost, Product, Service, SiteSettings } from "./types";
import { SITE_URL } from "./site";
import { BRAND_FALLBACK } from "./site";
import { resolveImage } from "./utils";

function brand(settings: SiteSettings | null) {
  return {
    name: settings?.site_title || BRAND_FALLBACK.site_title,
    phone: settings?.phone || BRAND_FALLBACK.phone,
    email: settings?.email || BRAND_FALLBACK.email,
    address: settings?.address || BRAND_FALLBACK.address,
    desc: settings?.company_desc || BRAND_FALLBACK.company_desc,
  };
}

export function organizationSchema(settings: SiteSettings | null): Record<string, unknown> {
  const b = brand(settings);
  const sameAs = [settings?.facebook, settings?.instagram, settings?.linkedin, settings?.youtube, settings?.tiktok].filter(
    Boolean,
  );
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: b.name,
    description: b.desc,
    url: SITE_URL,
    telephone: b.phone,
    email: b.email,
    image: `${SITE_URL}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address,
      addressLocality: "Bahawalpur",
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    areaServed: "PK",
    priceRange: "$$",
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

export function serviceSchema(service: Service, settings: SiteSettings | null): Record<string, unknown> {
  const b = brand(settings);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.short_desc || service.description,
    serviceType: service.category_name || "Security & IT",
    provider: { "@type": "LocalBusiness", name: b.name, telephone: b.phone },
    areaServed: "PK",
    url: `${SITE_URL}/services/${service.slug}`,
  };
}

export function productSchema(product: Product): Record<string, unknown> {
  const img = resolveImage(product.featured_image);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category_name || undefined,
    ...(img ? { image: img } : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      ...(product.price ? { price: product.price } : {}),
      availability:
        product.stock_status === "in_stock"
          ? "https://schema.org/InStock"
          : product.stock_status === "order"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${product.slug}`,
    },
  };
}

export function articleSchema(post: BlogPost, settings: SiteSettings | null): Record<string, unknown> {
  const b = brand(settings);
  const img = resolveImage(post.featured_image);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    ...(img ? { image: img } : {}),
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: { "@type": "Organization", name: b.name },
    publisher: { "@type": "Organization", name: b.name },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
