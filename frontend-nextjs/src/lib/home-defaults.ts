// Graceful-degradation defaults for the homepage. These mirror the backend seed
// content and are used ONLY when the CMS (home-sections) is unreachable or empty,
// so the page is never blank. When the backend returns data, it takes precedence.
import type { CtaSectionConfig, HeroConfig, IconTextItem, IndustryItem, StatItem } from "./types";

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

// Services/projects/testimonials shown when the catalog/portfolio APIs are empty,
// so the homepage still demonstrates the offering. Replaced by live data when present.
export const DEFAULT_SERVICES: Array<{ icon: string; title: string; short_desc: string; slug: string }> = [
  { icon: "📹", title: "CCTV Camera Installation", slug: "cctv-camera-installation", short_desc: "Complete CCTV setup for homes, offices, shops & warehouses with night vision & remote viewing." },
  { icon: "🌐", title: "Networking & IT Infrastructure", slug: "networking-it-infrastructure", short_desc: "Structured cabling, LAN/WAN setup, WiFi networks and enterprise-grade networking solutions." },
  { icon: "🔐", title: "Access Control & Biometrics", slug: "access-control-biometrics", short_desc: "Biometric access control, alarm systems and integrated security for your premises." },
  { icon: "🖥️", title: "Server Setup & Maintenance", slug: "server-setup-maintenance", short_desc: "Server installation, configuration, backup systems and ongoing maintenance support." },
  { icon: "🛒", title: "Hardware Sales & Support", slug: "hardware-sales-support", short_desc: "Genuine routers, switches, DVRs, cameras and IT hardware with after-sales support." },
  { icon: "🛠️", title: "Maintenance & AMC", slug: "maintenance-amc", short_desc: "Annual maintenance contracts for CCTV & networking systems with quick response." },
];
