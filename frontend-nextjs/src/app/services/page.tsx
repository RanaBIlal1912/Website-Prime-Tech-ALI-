import type { Metadata } from "next";
import { PageHero, EmptyState } from "@/components/ui";
import { Explorer, type ExplorerEntry } from "@/components/Explorer";
import { ServiceCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { getServices, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/services" });
}

export default async function ServicesPage() {
  const [services] = await Promise.all([getServices(), getSiteSettings()]);

  const entries: ExplorerEntry[] = services.map((s) => ({
    id: s.id,
    category: s.category_name || null,
    searchText: `${s.title} ${s.short_desc} ${s.description}`.toLowerCase(),
    node: <ServiceCard service={s} />,
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <PageHero
        eyebrow="Our Services"
        title="Security & IT services, delivered end-to-end"
        subtitle="CCTV, networking, fiber optic, access control, biometrics and ongoing maintenance — engineered and supported by certified professionals."
      />
      <section className="section">
        <div className="container-x">
          {services.length === 0 ? (
            <EmptyState title="Services are being updated" hint="Please check back shortly or contact us directly." />
          ) : (
            <Explorer entries={entries} searchPlaceholder="Search services…" />
          )}
        </div>
      </section>
    </>
  );
}
