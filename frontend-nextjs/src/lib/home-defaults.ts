// Graceful-degradation defaults for the homepage. These mirror the backend seed
// content and are used ONLY when the CMS (home-sections) is unreachable or empty,
// so the page is never blank. When the backend returns data, it takes precedence.
import type {
  BlogPost,
  CtaSectionConfig,
  HeroConfig,
  IconTextItem,
  IndustryItem,
  Product,
  Project,
  Service,
  StatItem,
} from "./types";

export const DEFAULT_SECTION_ORDER = [
  "hero",
  "stats",
  "services",
  "why-us",
  "projects",
  "testimonials",
  "industries",
  "cta",
];

export const DEFAULT_HERO: HeroConfig = {
  badge: "Trusted IT & Security Partner Since 2018",
  title: "Enterprise Security & IT Infrastructure",
  highlight: "Built to Protect What Matters",
  subtitle:
    "Prime Tech designs, installs and maintains CCTV, networking, fiber optic, access " +
    "control and biometric systems for homes and businesses across Pakistan.",
  primary_cta: { label: "Get a Free Quote", href: "/contact" },
  secondary_cta: { label: "Request Site Survey", href: "/contact" },
};

export const DEFAULT_STATS: StatItem[] = [
  { icon: "📹", value: 500, suffix: "+", label: "Projects Completed" },
  { icon: "😀", value: 300, suffix: "+", label: "Happy Clients" },
  { icon: "🏆", value: 8, suffix: "+", label: "Years Experience" },
  { icon: "🛠️", value: 24, suffix: "/7", label: "Support Available" },
];

export const DEFAULT_WHYUS: { subtitle: string; items: IconTextItem[] } = {
  subtitle: "Why industry leaders choose Prime Tech",
  items: [
    { icon: "🛡️", title: "Certified Engineers", text: "Manufacturer-certified technicians for every install and integration." },
    { icon: "⚡", title: "Fast Turnaround", text: "Most installations completed within 1–3 days with minimal disruption." },
    { icon: "🔧", title: "End-to-End Support", text: "From site survey to AMC, a single accountable partner for the lifecycle." },
    { icon: "✅", title: "Genuine Equipment", text: "Authentic, warranty-backed hardware from trusted global brands." },
  ],
};

export const DEFAULT_INDUSTRIES: { subtitle: string; items: IndustryItem[] } = {
  subtitle: "Security & IT solutions tailored to your sector",
  items: [
    { icon: "🏢", name: "Corporate Offices" },
    { icon: "🏭", name: "Factories & Warehouses" },
    { icon: "🏫", name: "Schools & Campuses" },
    { icon: "🏥", name: "Hospitals & Clinics" },
    { icon: "🏬", name: "Retail & Shops" },
    { icon: "🏛️", name: "Government" },
  ],
};

export const DEFAULT_CTA: CtaSectionConfig = {
  title: "Ready to Secure Your Business?",
  subtitle:
    "Book a free site survey and consultation for CCTV, networking, or access control. " +
    "Limited slots available this month.",
  primary_cta: { label: "Get Started", href: "/contact" },
};

// Services shown ONLY when the catalog API is unreachable (degraded mode), so the
// homepage still demonstrates the offering. When the backend is reachable, live data
// is used and an empty list hides the section instead (admin stays in control).
export interface DefaultService {
  icon: string;
  title: string;
  short_desc: string;
  slug: string;
}

export const DEFAULT_SERVICES: DefaultService[] = [
  { icon: "📹", title: "CCTV Camera Installation", slug: "cctv-camera-installation", short_desc: "Complete CCTV setup for homes, offices, shops & warehouses with night vision & remote viewing." },
  { icon: "🌐", title: "Networking & IT Infrastructure", slug: "networking-it-infrastructure", short_desc: "Structured cabling, LAN/WAN setup, WiFi networks and enterprise-grade networking solutions." },
  { icon: "🔐", title: "Access Control & Biometrics", slug: "access-control-biometrics", short_desc: "Biometric access control, alarm systems and integrated security for your premises." },
  { icon: "🖥️", title: "Server Setup & Maintenance", slug: "server-setup-maintenance", short_desc: "Server installation, configuration, backup systems and ongoing maintenance support." },
  { icon: "🛒", title: "Hardware Sales & Support", slug: "hardware-sales-support", short_desc: "Genuine routers, switches, DVRs, cameras and IT hardware with after-sales support." },
  { icon: "🛠️", title: "Maintenance & AMC", slug: "maintenance-amc", short_desc: "Annual maintenance contracts for CCTV & networking systems with quick response." },
];

// Adapt a fallback entry into a Service-shaped object so it can render through the
// shared <ServiceCard> (the card is pointed at the /services list, not a per-slug
// detail page, since those would 404 while the backend is unreachable).
export function toService(d: DefaultService): Service {
  return {
    id: d.slug,
    title: d.title,
    slug: d.slug,
    icon: d.icon,
    short_desc: d.short_desc,
    description: d.short_desc,
    benefits: [],
    faqs: [],
    category: null,
    category_name: null,
    featured_image: "",
    banner_image: "",
    background_image: "",
    background_video: "",
    gallery: [],
    seo_title: "",
    seo_description: "",
    is_published: true,
    is_featured: true,
    order: 0,
  };
}

// ---- Products / Projects / Posts fallbacks (degraded mode only) ----------------
// Shown when the catalog/portfolio/blog APIs are unreachable so those pages render
// a full body instead of an empty state. Cards link to their list page (not detail)
// to avoid 404s while the backend is down. Live data always replaces these.

export interface DefaultProduct {
  name: string;
  slug: string;
  category_name: string;
  price_label: string;
  badge: string;
  description: string;
}

export const DEFAULT_PRODUCTS: DefaultProduct[] = [
  { name: "4MP Dome CCTV Camera", slug: "4mp-dome-cctv-camera", category_name: "CCTV Camera", price_label: "Rs. 5,500", badge: "Best Seller", description: "4MP dome camera with 30m IR night vision for indoor/outdoor use." },
  { name: "8 Channel DVR", slug: "8-channel-dvr", category_name: "DVR", price_label: "Rs. 12,000", badge: "New", description: "8-channel DVR supporting up to 5MP and up to 10TB of storage." },
  { name: "Gigabit Network Switch", slug: "gigabit-network-switch", category_name: "Networking", price_label: "Rs. 7,000", badge: "", description: "24-port gigabit switch with 48 Gbps throughput, rack mountable." },
  { name: "Wireless Router AC1200", slug: "wireless-router-ac1200", category_name: "Router", price_label: "Rs. 4,500", badge: "Popular", description: "AC1200 dual-band router with 4 external antennas." },
];

export function toProduct(d: DefaultProduct): Product {
  return {
    id: d.slug,
    name: d.name,
    slug: d.slug,
    category: null,
    category_name: d.category_name,
    price: null,
    price_label: d.price_label,
    badge: d.badge,
    description: d.description,
    specs: [],
    featured_image: "",
    gallery: [],
    video: "",
    is_published: true,
    is_featured: true,
    stock_status: "in_stock",
    order: 0,
  };
}

export interface DefaultProject {
  title: string;
  slug: string;
  client_name: string;
  location: string;
  category: string;
  description: string;
}

export const DEFAULT_PROJECTS: DefaultProject[] = [
  { title: "Office CCTV Installation Project", slug: "office-cctv-installation-project", client_name: "ABC Corporate Office", location: "Bahawalpur, Punjab", category: "CCTV", description: "Complete 16-camera CCTV setup with central monitoring for a corporate office." },
  { title: "Warehouse Networking Setup", slug: "warehouse-networking-setup", client_name: "XYZ Logistics", location: "Multan, Punjab", category: "Networking", description: "Structured cabling and enterprise networking for a logistics warehouse." },
  { title: "School Security System", slug: "school-security-system", client_name: "Greenfield School", location: "Bahawalpur, Punjab", category: "Access Control", description: "Full perimeter CCTV coverage and biometric access control for a school campus." },
];

export function toProject(d: DefaultProject): Project {
  return {
    id: d.slug,
    title: d.title,
    slug: d.slug,
    description: d.description,
    client_name: d.client_name,
    location: d.location,
    completion_date: null,
    category: d.category,
    featured_image: "",
    gallery: [],
    videos: [],
    before_image: "",
    after_image: "",
    background_image: "",
    background_video: "",
    is_published: true,
    is_featured: true,
    order: 0,
  };
}

export interface DefaultPost {
  title: string;
  slug: string;
  category_name: string;
  excerpt: string;
}

export const DEFAULT_POSTS: DefaultPost[] = [
  { title: "How to Choose the Right CCTV System for Your Business", slug: "how-to-choose-the-right-cctv-system-for-your-business", category_name: "Buying Guides", excerpt: "Resolution, night vision, storage and remote access — the four factors that decide whether your CCTV investment actually protects your premises." },
  { title: "Structured Cabling: The Backbone of a Reliable Office Network", slug: "structured-cabling-the-backbone-of-a-reliable-office-network", category_name: "Security Insights", excerpt: "Wi-Fi gets the attention, but it's the cabling behind the walls that determines whether your network is fast, stable and future-proof." },
  { title: "Biometric Access Control vs. Traditional Locks", slug: "biometric-access-control-vs-traditional-locks", category_name: "Security Insights", excerpt: "Keys get copied and lost. Biometric and card-based access control give you audit trails, instant revocation and true accountability." },
];

export function toPost(d: DefaultPost): BlogPost {
  return {
    id: d.slug,
    title: d.title,
    slug: d.slug,
    excerpt: d.excerpt,
    content: "",
    featured_image: "",
    category: null,
    category_name: d.category_name,
    tags: [],
    author: null,
    author_name: null,
    status: "published",
    published_at: null,
    seo_title: "",
    seo_description: "",
    keywords: "",
    created_at: "",
    updated_at: "",
  };
}
