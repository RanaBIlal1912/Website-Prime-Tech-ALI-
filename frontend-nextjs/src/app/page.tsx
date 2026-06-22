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
  getProjects,
  getServices,
  getSiteSettings,
  getTestimonials,
  sectionByKey,
} from "@/lib/data";
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

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/" });
}

export default async function HomePage() {
  const [sections, settings, services, projects, testimonials] = await Promise.all([
    getHomeSections(),
    getSiteSettings(),
    getServices({ featured: true }),
    getProjects({ featured: true }),
    getTestimonials(),
  ]);

  const tagline = settings?.tagline || BRAND_FALLBACK.tagline;
  const hero = (sectionByKey(sections, "hero")?.config as HeroConfig) || {};
  const stats = (sectionByKey(sections, "stats")?.config?.items as StatItem[]) || [];
  const whyUs = sectionByKey(sections, "why-us")?.config as { items?: IconTextItem[]; subtitle?: string } | undefined;
  const industries = sectionByKey(sections, "industries")?.config as
    | { items?: IndustryItem[]; subtitle?: string }
    | undefined;
  const cta = (sectionByKey(sections, "cta")?.config as CtaSectionConfig) || {};

  // Render in the admin-defined order; unknown/disabled keys are skipped.
  const enabledKeys = sections.map((s) => s.key);
  const has = (key: string) => enabledKeys.includes(key);

  return (
    <>
      <JsonLd data={organizationSchema(settings)} />

      {has("hero") && <Hero config={hero} tagline={tagline} />}

      {has("stats") && stats.length > 0 && (
        <section className="container-x -mt-20 relative z-10 pb-4">
          <StatsCounter items={stats} />
        </section>
      )}

      {has("services") && services.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeading
              eyebrow="What We Do"
              title="Comprehensive security & IT services"
              subtitle="From CCTV and access control to enterprise networking — delivered end-to-end."
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 6).map((service, i) => (
                <Reveal key={service.id} index={i}>
                  <ServiceCard service={service} />
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

      {has("why-us") && <WhyUs items={whyUs?.items || []} subtitle={whyUs?.subtitle} />}

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

      {has("industries") && <IndustriesStrip items={industries?.items || []} subtitle={industries?.subtitle} />}

      {has("cta") && <CtaBanner config={cta} />}
    </>
  );
}
