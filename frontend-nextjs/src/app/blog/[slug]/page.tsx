import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Media } from "@/components/Media";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { PostCard } from "@/components/cards";
import { ShareButtons } from "@/components/ShareButtons";
import { JsonLd } from "@/components/JsonLd";
import { getPost, getPosts, getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found" };
  return buildMetadata({
    path: `/blog/${slug}`,
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    image: post.featured_image,
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPost(slug), getSiteSettings()]);
  if (!post) notFound();

  const all = await getPosts();
  const related = all
    .filter((p) => p.slug !== post.slug && p.category_name === post.category_name)
    .slice(0, 3);
  const fallbackRelated = related.length ? related : all.filter((p) => p.slug !== post.slug).slice(0, 3);

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), articleSchema(post, settings)]} />

      <article>
        <header className="border-b border-white/[0.06] bg-hero-mesh pt-28 sm:pt-32">
          <div className="container-x max-w-3xl pb-12">
            <Breadcrumbs items={crumbs} />
            <div className="flex flex-wrap items-center gap-2 text-sm text-content-muted">
              {post.category_name ? <span className="text-primary">{post.category_name}</span> : null}
              {post.published_at ? <span>· {formatDate(post.published_at)}</span> : null}
              {post.author_name ? <span>· {post.author_name}</span> : null}
            </div>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-content">
              {post.title}
            </h1>
            {post.excerpt ? <p className="mt-4 text-lg text-content-muted">{post.excerpt}</p> : null}
            {post.tags?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="chip">
                    #{t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        <div className="container-x max-w-3xl py-12">
          <Media
            src={post.featured_image}
            alt={post.title}
            seed={post.slug}
            icon="📝"
            priority
            className="mb-10 aspect-[16/9] w-full rounded-brand border border-white/[0.06]"
          />
          {/* Content is trusted HTML authored in our own CMS. */}
          <div className="prose-content max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="mt-10 border-t border-white/[0.06] pt-6">
            <ShareButtons url={`${SITE_URL}/blog/${post.slug}`} title={post.title} />
          </div>
        </div>
      </article>

      {fallbackRelated.length > 0 && (
        <section className="section pt-0">
          <div className="container-x">
            <SectionHeading eyebrow="Keep reading" title="Related articles" align="left" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fallbackRelated.map((p, i) => (
                <Reveal key={p.id} index={i}>
                  <PostCard post={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
