import type { Metadata } from "next";
import { PageHero, EmptyState } from "@/components/ui";
import { Explorer, type ExplorerEntry } from "@/components/Explorer";
import { ProjectCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { getProjects, isBackendReachable } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { PAGE_HEROES } from "@/lib/hero-images";
import { DEFAULT_PROJECTS, toProject } from "@/lib/home-defaults";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/portfolio" });
}

export default async function PortfolioPage() {
  const [reachable, projects] = await Promise.all([isBackendReachable(), getProjects()]);

  const useDefaults = !reachable && projects.length === 0;
  const items = projects.length > 0 ? projects : useDefaults ? DEFAULT_PROJECTS.map(toProject) : [];
  const fallbackHref = useDefaults ? "/portfolio" : undefined;

  const entries: ExplorerEntry[] = items.map((p) => ({
    id: p.id,
    category: p.category || null,
    searchText: `${p.title} ${p.description} ${p.client_name} ${p.location}`.toLowerCase(),
    node: <ProjectCard project={p} href={fallbackHref} />,
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Portfolio", path: "/portfolio" },
        ])}
      />
      <PageHero
        eyebrow="Portfolio"
        title="Projects delivered with precision"
        subtitle="A selection of CCTV, networking and security installations completed for businesses, schools and warehouses across Pakistan."
        image={PAGE_HEROES.portfolio}
      />
      <section className="section">
        <div className="container-x">
          {items.length === 0 ? (
            <EmptyState title="Projects are being added" hint="Contact us to discuss your project requirements." />
          ) : (
            <Explorer entries={entries} searchPlaceholder="Search projects…" />
          )}
        </div>
      </section>
    </>
  );
}
