import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui";
import { StatsCounter } from "@/components/StatsCounter";
import { WhyUs, IndustriesStrip } from "@/components/home/sections";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { TestimonialCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import {
  getHomeSections,
  getSiteSettings,
  getTestimonials,
  sectionByKey,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { BRAND_FALLBACK } from "@/lib/site";
import type { IconTextItem, IndustryItem, StatItem } from "@/lib/types";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/about",
    title: "About Prime Tech",
    description:
      "Prime Tech is a trusted security and IT solutions provider delivering CCTV, networking, access control and biometric systems across Pakistan.",
  });
}

export default async function AboutPage() {
  const [sections, settings, testimonials] = await Promise.all([
    getHomeSections(),
    getSiteSettings(),
    getTestimonials(),
  ]);

  const desc = settings?.company_desc || BRAND_FALLBACK.company_desc;
  const stats = (sectionByKey(sections, "stats")?.config?.items as StatItem[]) || [];
  const whyUs = sectionByKey(sections, "why-us")?.config as { items?: IconTextItem[]; subtitle?: string } | undefined;
  const industries = sectionByKey(sections, "industries")?.config as
    | { items?: IndustryItem[]; subtitle?: string }
    | undefined;

  const pillars = [
    { icon: "🎯", title: "Our Mission", text: "To make enterprise-grade security and IT accessible, reliable and affordable for every business in Pakistan." },
    { icon: "👁️", title: "Our Vision", text: "To be the most trusted security and infrastructure partner in the region — known for quality and accountability." },
    { icon: "🤝", title: "Our Promise", text: "Genuine equipment, certified engineers, and support that stays with you long after installation." },
  ];

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(settings),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="About Prime Tech"
        title="A trusted security & IT partner since 2018"
        subtitle={desc}
      />

      {stats.length > 0 && (
        <section className="container-x -mt-8">
          <StatsCounter items={stats} />
        </section>
      )}

      <section className="section">
        <div className="container-x grid gap-6 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} index={i} className="card p-7">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/[0.04] text-2xl" aria-hidden>
                {p.icon}
              </div>
              <h2 className="mt-4 text-lg font-bold text-content">{p.title}</h2>
              <p className="mt-2 text-sm text-content-muted">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <WhyUs items={whyUs?.items || []} subtitle={whyUs?.subtitle} />
      <IndustriesStrip items={industries?.items || []} subtitle={industries?.subtitle} />

      {testimonials.length > 0 && (
        <section className="section pt-0">
          <div className="container-x">
            <SectionHeading eyebrow="Testimonials" title="Trusted by our clients" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 3).map((t, i) => (
                <Reveal key={t.id} index={i}>
                  <TestimonialCard testimonial={t} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section pt-0">
        <div className="container-x">
          <Reveal className="rounded-brand border border-primary/20 bg-hero-mesh px-6 py-14 text-center sm:py-16">
            <h2 className="text-2xl font-bold text-content sm:text-3xl">Work with a partner you can trust</h2>
            <Link href="/contact" className="btn-primary mt-6">
              Get in touch
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
