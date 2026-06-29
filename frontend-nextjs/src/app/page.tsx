import Link from "next/link";
import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { StatsCounter } from "@/components/StatsCounter";
import { WhyUs, IndustriesStrip, CtaBanner } from "@/components/home/sections";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Media } from "@/components/Media";
import { ServiceCard, ProjectCard, TestimonialCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import {
  getHomeSections,
  getPageBackground,
  getProjects,
  getServices,
  getSiteSettings,
  getTestimonials,
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
} from "@/lib/home-defaults";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/" });
}

export default async function HomePage() {
  const [sections, settings, services, projects, testimonials, homeBg] = await Promise.all([
    getHomeSections(),
    getSiteSettings(),
    getServices({ featured: true }),
    getProjects({ featured: true }),
    getTestimonials(),
    getPageBackground("home"),
  ]);

  const tagline = settings?.tagline || BRAND_FALLBACK.tagline;

  // Hero background: a real image by default (admin-managed via PageBackground.image_url,
  // falling back to the bundled brand photo). A video only kicks in when bg_type=video.
  const heroImage = resolveImage(homeBg?.image_url) || "/hero-bg.jpg";
  const heroVideo = homeBg?.bg_type === "video" ? resolveImage(homeBg?.video_url) : null;
  const heroOverlay = homeBg?.overlay_opacity ? Math.min(homeBg.overlay_opacity, 0.5) : 0.45;

  // Merge CMS config with built-in defaults so the homepage is NEVER blank, even when
  // the backend is unreachable/unseeded. Live CMS data always takes precedence.
  const hero: HeroConfig = { ...DEFAULT_HERO, ...((sectionByKey(sections, "hero")?.config as HeroConfig) || {}) };

  const cmsStats = sectionByKey(sections, "stats")?.config?.items as StatItem[] | undefined;
  const stats = cmsStats?.length ? cmsStats : DEFAULT_STATS;

  const cmsWhy = sectionByKey(sections, "why-us")?.config as { items?: IconTextItem[]; subtitle?: string } | undefined;
  const whyUs = cmsWhy?.items?.length ? cmsWhy : DEFAULT_WHYUS;

  const cmsInd = sectionByKey(sections, "industries")?.config as { items?: IndustryItem[]; subtitle?: string } | undefined;
  const industries = cmsInd?.items?.length ? cmsInd : DEFAULT_INDUSTRIES;

  const cta: CtaSectionConfig = { ...DEFAULT_CTA, ...((sectionByKey(sections, "cta")?.config as CtaSectionConfig) || {}) };

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
          imageUrl={heroImage}
          videoUrl={heroVideo}
          overlayOpacity={heroOverlay}
        />
      )}

      {has("stats") && (
        <section className="container-x relative z-10 -mt-20 pb-4">
          <StatsCounter items={stats} />
        </section>
      )}

      {has("services") && (
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow="What We Do"
              title="Comprehensive security & IT services"
              subtitle="From CCTV and access control to enterprise networking — delivered end-to-end."
            />
            {services.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.slice(0, 6).map((service, i) => (
                  <Reveal key={service.id} index={i}>
                    <ServiceCard service={service} />
                  </Reveal>
                ))}
              </div>
            ) : (
              // Fallback when the catalog API is empty/unreachable.
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {DEFAULT_SERVICES.map((s, i) => (
                  <Reveal key={s.slug} index={i}>
                    <Link href={`/services/${s.slug}`} className="card group flex h-full flex-col overflow-hidden">
                      <Media src={null} alt={s.title} seed={s.slug} icon={s.icon} className="aspect-[16/10] w-full" />
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-lg font-bold text-content transition-colors group-hover:text-primary">{s.title}</h3>
                        <p className="mt-2 line-clamp-3 flex-1 text-sm text-content-muted">{s.short_desc}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                          Learn more <span aria-hidden>→</span>
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
            <div className="mt-10 text-center">
              <Link href="/services" className="btn-ghost">
                View all services
              </Link>
            </div>
          </div>
        </section>
      )}

      {has("why-us") && <WhyUs items={whyUs.items || []} subtitle={whyUs.subtitle} />}

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

      {has("industries") && <IndustriesStrip items={industries.items || []} subtitle={industries.subtitle} />}

      {has("cta") && <CtaBanner config={cta} />}
    </>
  );
}
