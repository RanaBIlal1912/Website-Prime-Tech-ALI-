import type { Metadata } from "next";
import { PageHero, EmptyState } from "@/components/ui";
import { Explorer, type ExplorerEntry } from "@/components/Explorer";
import { ProductCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { getProducts, isBackendReachable } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { PAGE_HEROES } from "@/lib/hero-images";
import { DEFAULT_PRODUCTS, toProduct } from "@/lib/home-defaults";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/products" });
}

export default async function ProductsPage() {
  const [reachable, products] = await Promise.all([isBackendReachable(), getProducts()]);

  const useDefaults = !reachable && products.length === 0;
  const items = products.length > 0 ? products : useDefaults ? DEFAULT_PRODUCTS.map(toProduct) : [];
  const fallbackHref = useDefaults ? "/products" : undefined;

  const entries: ExplorerEntry[] = items.map((p) => ({
    id: p.id,
    category: p.category_name || null,
    searchText: `${p.name} ${p.description} ${p.category_name ?? ""}`.toLowerCase(),
    node: <ProductCard product={p} href={fallbackHref} />,
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
        ])}
      />
      <PageHero
        eyebrow="Products"
        title="Genuine security & networking hardware"
        subtitle="CCTV cameras, DVRs, network switches and routers — authentic, warranty-backed equipment with full after-sales support."
        image={PAGE_HEROES.products}
      />
      <section className="section">
        <div className="container-x">
          {items.length === 0 ? (
            <EmptyState title="Products are being updated" hint="Please check back shortly or contact us for a custom quote." />
          ) : (
            <Explorer
              entries={entries}
              searchPlaceholder="Search products…"
              gridClassName="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            />
          )}
        </div>
      </section>
    </>
  );
}
