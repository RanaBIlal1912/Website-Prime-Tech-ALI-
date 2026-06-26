import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Media } from "@/components/Media";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ProductCard } from "@/components/cards";
import { Gallery } from "@/components/Gallery";
import { VideoEmbed } from "@/components/VideoEmbed";
import { JsonLd } from "@/components/JsonLd";
import { getProduct, getProducts } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, productSchema } from "@/lib/schema";

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return buildMetadata({
    path: `/products/${slug}`,
    title: product.name,
    description: product.description || `${product.name} — genuine hardware with full support.`,
    image: product.featured_image,
  });
}

const stockLabel: Record<string, string> = {
  in_stock: "In stock",
  order: "Available on order",
  out: "Out of stock",
};

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all
    .filter((p) => p.slug !== product.slug && p.category_name === product.category_name)
    .slice(0, 4);
  const fallbackRelated = related.length ? related : all.filter((p) => p.slug !== product.slug).slice(0, 4);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.name, path: `/products/${product.slug}` },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), productSchema(product)]} />

      <section className="border-b border-white/[0.06] pt-28 sm:pt-32">
        <div className="container-x pb-12">
          <Breadcrumbs items={crumbs} />
          <div className="grid gap-10 lg:grid-cols-2">
            <Media
              src={product.featured_image}
              alt={product.name}
              seed={product.slug}
              icon="📦"
              priority
              className="aspect-square w-full rounded-brand border border-white/[0.06]"
            />
            <div>
              {product.category_name ? <span className="chip">{product.category_name}</span> : null}
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-content sm:text-4xl">
                {product.name}
              </h1>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-2xl font-bold text-accent">
                  {product.price_label || "Request price"}
                </span>
                {product.badge ? (
                  <span className="rounded-full bg-brand-gradient px-3 py-1 text-xs font-bold text-ink">
                    {product.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-content-muted">
                {stockLabel[product.stock_status] || ""}
              </p>
              {product.description ? (
                <p className="mt-5 text-content-muted">{product.description}</p>
              ) : null}

              {product.specs?.length ? (
                <div className="mt-6 overflow-hidden rounded-brand border border-white/[0.06]">
                  <table className="w-full text-sm">
                    <tbody>
                      {product.specs.map((spec, i) => (
                        <tr key={i} className="border-b border-white/[0.06] last:border-0">
                          <th className="bg-white/[0.02] px-4 py-3 text-left font-medium text-content-muted">
                            {spec.key}
                          </th>
                          <td className="px-4 py-3 text-content">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={`/contact?service=${encodeURIComponent(product.name)}`} className="btn-primary">
                  Request a quote
                </Link>
                <Link href="/products" className="btn-ghost">
                  All products
                </Link>
              </div>
            </div>
          </div>

          {product.video ? (
            <div className="mt-12">
              <h2 className="mb-4 text-xl font-bold text-content">Product video</h2>
              <VideoEmbed src={product.video} title={product.name} />
            </div>
          ) : null}

          {product.gallery?.length ? (
            <div className="mt-12">
              <h2 className="mb-4 text-xl font-bold text-content">Gallery</h2>
              <Gallery images={product.gallery} alt={product.name} />
            </div>
          ) : null}
        </div>
      </section>

      {fallbackRelated.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeading eyebrow="You may also like" title="Related products" align="left" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {fallbackRelated.map((p, i) => (
                <Reveal key={p.id} index={i}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
