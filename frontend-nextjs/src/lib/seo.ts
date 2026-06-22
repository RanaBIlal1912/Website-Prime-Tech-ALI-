import type { Metadata } from "next";
import { getSeo, getSiteSettings } from "./data";
import { SITE_URL } from "./site";
import { resolveImage } from "./utils";

interface BuildSeoArgs {
  /** route path, must match a SeoSetting.path (e.g. "/services") */
  path: string;
  /** per-page overrides when there is no SeoSetting row or for dynamic detail pages */
  title?: string;
  description?: string;
  image?: string | null;
  noindex?: boolean;
}

/** Build Next.js Metadata, merging CMS SeoSetting → SiteSetting → page overrides. */
export async function buildMetadata(args: BuildSeoArgs): Promise<Metadata> {
  const [seo, settings] = await Promise.all([getSeo(args.path), getSiteSettings()]);
  const brand = settings?.site_title || "Prime Tech";

  const title = args.title || seo?.meta_title || brand;
  const description =
    args.description ||
    seo?.meta_description ||
    settings?.company_desc ||
    "Professional CCTV, networking and security solutions.";
  const canonical = seo?.canonical_url || `${SITE_URL}${args.path === "/" ? "" : args.path}`;
  const ogImage = resolveImage(args.image || seo?.og_image) || `${SITE_URL}/opengraph-image`;
  const fullTitle = title === brand ? title : `${title} | ${brand}`;

  return {
    title: fullTitle,
    description,
    keywords: seo?.keywords || undefined,
    alternates: { canonical },
    robots: args.noindex ? { index: false, follow: false } : seo?.robots || "index,follow",
    openGraph: {
      title: seo?.og_title || fullTitle,
      description: seo?.og_description || description,
      url: canonical,
      siteName: brand,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.og_title || fullTitle,
      description: seo?.og_description || description,
      images: [ogImage],
    },
  };
}
