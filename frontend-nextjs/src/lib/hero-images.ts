// Themed hero background images (royalty-free, bundled under /public/heroes).
// Used for each page's hero and as a per-service fallback when a service has no
// admin-set featured_image.

// Default homepage hero slideshow — a few varied, on-brand photos that fade in
// rotation. Admin can override via the hero section config `images` array.
export const HOME_HERO_IMAGES = [
  "/hero-bg.jpg",
  "/heroes/cctv.jpg",
  "/heroes/networking.jpg",
  "/heroes/access.jpg",
];

export const PAGE_HEROES = {
  services: "/heroes/cctv.jpg",
  products: "/heroes/hardware.jpg",
  portfolio: "/heroes/server.jpg",
  blog: "/heroes/blog.jpg",
  about: "/heroes/team.jpg",
  contact: "/heroes/office.jpg",
} as const;

const SERVICE_HERO_BY_SLUG: Record<string, string> = {
  "cctv-camera-installation": "/heroes/cctv.jpg",
  "networking-it-infrastructure": "/heroes/networking.jpg",
  "server-setup-maintenance": "/heroes/server.jpg",
  "access-control-biometrics": "/heroes/access.jpg",
  "hardware-sales-support": "/heroes/hardware.jpg",
  "maintenance-amc": "/heroes/maintenance.jpg",
};

// Best-effort themed image for a service by slug (keyword match), defaulting to the
// CCTV/security image. Used only as a visual fallback — real featured_image wins.
export function serviceHeroImage(slug: string): string {
  if (SERVICE_HERO_BY_SLUG[slug]) return SERVICE_HERO_BY_SLUG[slug];
  const s = slug.toLowerCase();
  if (s.includes("network") || s.includes("fiber") || s.includes("cabl")) return "/heroes/networking.jpg";
  if (s.includes("server")) return "/heroes/server.jpg";
  if (s.includes("access") || s.includes("biometric") || s.includes("lock")) return "/heroes/access.jpg";
  if (s.includes("hardware") || s.includes("product")) return "/heroes/hardware.jpg";
  if (s.includes("maint") || s.includes("amc") || s.includes("support")) return "/heroes/maintenance.jpg";
  return "/heroes/cctv.jpg";
}
