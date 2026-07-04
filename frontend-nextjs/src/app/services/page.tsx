import type { Metadata } from "next";
import { PageHero, EmptyState } from "@/components/ui";
import { Explorer, type ExplorerEntry } from "@/components/Explorer";
import { ServiceCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { getServices, isBackendReachable } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { PAGE_HEROES } from "@/lib/hero-images";
import { DEFAULT_SERVICES, toService } from "@/lib/home-defaults";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/services" });
}

export default async function ServicesPage() {
  const [reachable, services] = await Promise.all([isBackendReachable(), getServices()]);

  // Live data when present; in degraded mode (backend unreachable) fall back to a
  // representative set so the page is never empty. Fallback cards link to /services.
  const useDefaults = !reachable && services.length === 0;
  const items = services.length > 0 ? services : useDefaults ? DEFAULT_SERVICES.map(toService) : [];
  const fallbackHref = useDefaults ? "/services" : undefined;

  const entries: ExplorerEntry[] = items.map((s) => ({
    id: s.id,
    category: s.category_name || null,
    searchText: `${s.title} ${s.short_desc} ${s.description}`.toLowerCase(),
    node: <ServiceCard service={s} href={fallbackHref} />,
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
        image={PAGE_HEROES.services}
      />
      <section className="section">
        <div className="container-x">
          {items.length === 0 ? (
            <EmptyState title="Services are being updated" hint="Please check back shortly or contact us directly." />
          ) : (
            <Explorer entries={entries} searchPlaceholder="Search services…" />
          )}
        </div>
      </section>
    </>
  );
}
