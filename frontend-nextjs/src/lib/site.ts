// Static navigation + site constants. Brand/content come from the API; these are
// structural (route map) and safe fallbacks used only when the API is unreachable.

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Products", href: "/products" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

// Fallback brand values — only used if /cms/settings/ is unreachable at build time.
export const BRAND_FALLBACK = {
  site_title: "Prime Tech",
  tagline: "Your Security, Our Priority",
  company_desc:
    "Prime Tech delivers professional CCTV, networking, server and security solutions for homes and businesses across Pakistan.",
  whatsapp: "923001234567",
  phone: "+92 300 1234567",
  email: "info@primetech.pk",
  address: "Office #12, IT Plaza, Bahawalpur, Punjab, Pakistan",
  footer_text: "© Prime Tech. All Rights Reserved.",
};

export function whatsappLink(number: string, text?: string): string {
  const clean = (number || "").replace(/[^\d]/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${clean}${q}`;
}

export function telLink(phone: string): string {
  return `tel:${(phone || "").replace(/\s+/g, "")}`;
}
