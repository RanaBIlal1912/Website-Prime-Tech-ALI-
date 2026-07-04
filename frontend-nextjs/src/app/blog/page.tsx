import type { Metadata } from "next";
import { PageHero, EmptyState } from "@/components/ui";
import { Explorer, type ExplorerEntry } from "@/components/Explorer";
import { PostCard } from "@/components/cards";
import { JsonLd } from "@/components/JsonLd";
import { getPosts, isBackendReachable } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { PAGE_HEROES } from "@/lib/hero-images";
import { DEFAULT_POSTS, toPost } from "@/lib/home-defaults";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/blog" });
}

export default async function BlogPage() {
  const [reachable, posts] = await Promise.all([isBackendReachable(), getPosts()]);

  const useDefaults = !reachable && posts.length === 0;
  const items = posts.length > 0 ? posts : useDefaults ? DEFAULT_POSTS.map(toPost) : [];
  const fallbackHref = useDefaults ? "/blog" : undefined;

  const entries: ExplorerEntry[] = items.map((p) => ({
    id: p.id,
    category: p.category_name || null,
    searchText: `${p.title} ${p.excerpt} ${(p.tags || []).join(" ")}`.toLowerCase(),
    node: <PostCard post={p} href={fallbackHref} />,
  }));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <PageHero
        eyebrow="Insights"
        title="Security & IT insights"
        subtitle="Expert guides and practical advice on CCTV, networking, access control and keeping your business secure."
        image={PAGE_HEROES.blog}
      />
      <section className="section">
        <div className="container-x">
          {items.length === 0 ? (
            <EmptyState title="No articles yet" hint="We're preparing in-depth guides. Check back soon." />
          ) : (
            <Explorer entries={entries} searchPlaceholder="Search articles…" />
          )}
        </div>
      </section>
    </>
  );
}
