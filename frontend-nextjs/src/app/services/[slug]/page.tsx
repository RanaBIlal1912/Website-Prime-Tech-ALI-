import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Media } from "@/components/Media";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/cards";
import { Gallery } from "@/components/Gallery";
import { JsonLd } from "@/components/JsonLd";
import { getService, getServices, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/schema";
import { serviceHeroImage } from "@/lib/hero-images";

export const revalidate = 300;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return { title: "Service not found" };
  return buildMetadata({
    path: `/services/${slug}`,
    title: service.seo_title || service.title,
    description: service.seo_description || service.short_desc,
    image: service.featured_image,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([getService(slug), getSiteSettings()]);
  if (!service) notFound();

  const related = (await getServices()).filter((s) => s.slug !== service.slug).slice(0, 3);
  // Themed photo per service, used when the admin hasn't set a featured_image.
  const heroImg = service.featured_image || serviceHeroImage(service.slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.title, path: `/services/${service.slug}` },
  ];

  const schemas: Record<string, unknown>[] = [
    breadcrumbSchema(crumbs),
    serviceSchema(service, settings),
  ];
  if (service.faqs?.length) schemas.push(faqSchema(service.faqs));

  return (
    <>
      <JsonLd data={schemas} />

      <section className="relative overflow-hidden border-b border-white/[0.06] bg-hero-mesh pt-28 sm:pt-32">
        <div className="container-x grid items-center gap-10 pb-14 pt-4 lg:grid-cols-2">
          <div>
            <Breadcrumbs items={crumbs} />
            <span className="text-5xl" aria-hidden>
              {service.icon || "🛡️"}
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-content sm:text-5xl">
              {service.title}
            </h1>
            <p className="mt-4 max-w-xl text-content-muted">{service.short_desc}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="btn-primary"
              >
                Request this service
              </Link>
              <Link href="/services" className="btn-ghost">
                All services
              </Link>
            </div>
          </div>
          <Media
            src={heroImg}
            alt={service.title}
            seed={service.slug}
            icon={service.icon || "🛡️"}
            priority
            className="aspect-[4/3] w-full rounded-brand border border-white/[0.06]"
          />
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {service.description ? (
              <div className="prose-content max-w-none">
                {service.description.split("\n").filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}

            {service.gallery?.length ? (
              <div className="mt-10">
                <h2 className="mb-4 text-xl font-bold text-content">Gallery</h2>
                <Gallery images={service.gallery} alt={service.title} />
              </div>
            ) : null}

            {service.faqs?.length ? (
              <div className="mt-12">
                <h2 className="mb-4 text-xl font-bold text-content">Frequently asked questions</h2>
                <div className="space-y-3">
                  {service.faqs.map((faq, i) => (
                    <details key={i} className="card group p-5 [&_summary]:cursor-pointer">
                      <summary className="flex items-center justify-between font-semibold text-content">
                        {faq.q}
                        <span className="text-primary transition-transform group-open:rotate-45" aria-hidden>
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-sm text-content-muted">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-1">
            <div className="card sticky top-24 p-6">
              {service.benefits?.length ? (
                <>
                  <h2 className="text-lg font-bold text-content">What you get</h2>
                  <ul className="mt-4 space-y-3">
                    {service.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-content-muted">
                        <span className="mt-0.5 text-accent" aria-hidden>
                          ✓
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              <Link
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="btn-primary btn-sm mt-6 w-full"
              >
                Get a free quote
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section pt-0">
          <div className="container-x">
            <SectionHeading eyebrow="Explore more" title="Related services" align="left" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s, i) => (
                <Reveal key={s.id} index={i}>
                  <ServiceCard service={s} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
