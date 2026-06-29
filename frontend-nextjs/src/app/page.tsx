import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { StatsCounter } from "@/components/StatsCounter";
import { WhyUs, IndustriesStrip, CtaBanner } from "@/components/home/sections";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { ServiceCard, ProjectCard, TestimonialCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import {
  getHomeSections,
  getPageBackground,
  getProjects,
  getServices,
  getSiteSettings,
  getTestimonials,
  isBackendReachable,
  sectionByKey,
} from "@/lib/data";
import { resolveImage } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { organizationSchema } from "@/lib/schema";
import type {
  CtaSectionConfig,
  HeroConfig,
  IconTextItem,
  IndustryItem,
  StatItem,
} from "@/lib/types";
import { BRAND_FALLBACK } from "@/lib/site";
import {
  DEFAULT_CTA,
  DEFAULT_HERO,
  DEFAULT_INDUSTRIES,
  DEFAULT_SECTION_ORDER,
  DEFAULT_SERVICES,
  DEFAULT_STATS,
  DEFAULT_WHYUS,
  toService,
} from "@/lib/home-defaults";
import { HOME_HERO_IMAGES } from "@/lib/hero-images";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/" });
}

export default async function HomePage() {
  const [reachable, sections, settings, services, projects, testimonials, homeBg] = await Promise.all([
    isBackendReachable(),
    getHomeSections(),
    getSiteSettings(),
    getServices({ featured: true }),
    getProjects({ featured: true }),
    getTestimonials(),
    getPageBackground("home"),
  ]);

  const tagline = settings?.tagline || BRAND_FALLBACK.tagline;

  // Built-in defaults are used ONLY when the backend is unreachable (degraded mode),
  // so the page is never blank. When the backend IS reachable, live CMS data is used
  // verbatim and an empty/cleared section simply hides — the admin stays in control.
  const useDefaults = !reachable;

  const cmsHero = (sectionByKey(sections, "hero")?.config as HeroConfig) || {};
  const hero: HeroConfig = useDefaults ? DEFAULT_HERO : cmsHero;

  // Hero background slideshow: admin-managed image list when set, otherwise the
  // single PageBackground image, otherwise the default multi-image slideshow.
  // A video (bg_type=video) overrides the images.
  const cmsImages = Array.isArray(cmsHero.images)
    ? cmsHero.images.map(resolveImage).filter((x): x is string => Boolean(x))
    : [];
  const bgImage = resolveImage(homeBg?.image_url);
  const heroImages = cmsImages.length > 0 ? cmsImages : bgImage ? [bgImage] : HOME_HERO_IMAGES;
  const heroVideo = homeBg?.bg_type === "video" ? resolveImage(homeBg?.video_url) : null;
  const heroOverlay = homeBg?.overlay_opacity != null ? Math.min(homeBg.overlay_opacity, 0.5) : 0.45;

  const cmsStats = (sectionByKey(sections, "stats")?.config?.items as StatItem[] | undefined) || [];
  const stats = useDefaults ? DEFAULT_STATS : cmsStats;

  const cmsWhy = (sectionByKey(sections, "why-us")?.config as { items?: IconTextItem[]; subtitle?: string }) || {};
  const whyUs = useDefaults ? DEFAULT_WHYUS : cmsWhy;

  const cmsInd = (sectionByKey(sections, "industries")?.config as { items?: IndustryItem[]; subtitle?: string }) || {};
  const industries = useDefaults ? DEFAULT_INDUSTRIES : cmsInd;

  const cmsCta = (sectionByKey(sections, "cta")?.config as CtaSectionConfig) || {};
  const cta = useDefaults ? DEFAULT_CTA : cmsCta;

  // Services to display: live data when reachable, fallback list only in degraded mode.
  // Fallback cards link to the /services list (not per-slug detail pages, which 404
  // while the backend is down).
  const displayServices = useDefaults ? DEFAULT_SERVICES.map(toService) : services.slice(0, 6);
  const serviceHref = useDefaults ? "/services" : undefined;

  // Section order/enablement comes from the CMS when present; otherwise a sensible default.
  const orderedKeys = sections.length ? sections.map((s) => s.key) : DEFAULT_SECTION_ORDER;
  const has = (key: string) => orderedKeys.includes(key);

  return (
    <>
      <JsonLd data={organizationSchema(settings)} />

      {has("hero") && (
        <Hero
          config={hero}
          tagline={tagline}
          images={heroImages}
          videoUrl={heroVideo}
          overlayOpacity={heroOverlay}
        />
      )}

      {has("stats") && stats.length > 0 && (
        <section className="container-x relative z-10 -mt-20 pb-4">
          <StatsCounter items={stats} />
        </section>
      )}

      {has("services") && displayServices.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow="What We Do"
              title="Comprehensive security & IT services"
              subtitle="From CCTV and access control to enterprise networking — delivered end-to-end."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayServices.map((service, i) => (
                <Reveal key={service.id} index={i}>
                  <ServiceCard service={service} href={serviceHref} />
                </Reveal>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/services" className="btn-ghost">
                View all services
              </Link>
            </div>
          </div>
        </section>
      )}

      {has("why-us") && (whyUs.items?.length ?? 0) > 0 && (
        <WhyUs items={whyUs.items || []} subtitle={whyUs.subtitle} />
      )}

      {has("projects") && projects.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow="Our Work"
              title="Featured projects"
              subtitle="A selection of installations delivered for businesses across Pakistan."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.slice(0, 6).map((project, i) => (
                <Reveal key={project.id} index={i}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/portfolio" className="btn-ghost">
                Explore portfolio
              </Link>
            </div>
          </div>
        </section>
      )}

      {has("testimonials") && testimonials.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeading eyebrow="Testimonials" title="What our clients say" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 6).map((t, i) => (
                <Reveal key={t.id} index={i}>
                  <TestimonialCard testimonial={t} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {has("industries") && (industries.items?.length ?? 0) > 0 && (
        <IndustriesStrip items={industries.items || []} subtitle={industries.subtitle} />
      )}

      {has("cta") && (cta.title || cta.subtitle) && <CtaBanner config={cta} />}
    </>
  );
}
