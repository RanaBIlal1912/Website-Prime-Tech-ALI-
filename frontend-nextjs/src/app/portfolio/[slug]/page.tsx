import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Media } from "@/components/Media";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCard } from "@/components/cards";
import { Gallery } from "@/components/Gallery";
import { VideoEmbed } from "@/components/VideoEmbed";
import { BeforeAfter } from "@/components/BeforeAfter";
import { JsonLd } from "@/components/JsonLd";
import { getProject, getProjects } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };
  return buildMetadata({
    path: `/portfolio/${slug}`,
    title: project.title,
    description: project.description,
    image: project.featured_image,
  });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const all = await getProjects();
  const related = all.filter((p) => p.slug !== project.slug).slice(0, 3);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: project.title, path: `/portfolio/${project.slug}` },
  ];

  const facts = [
    project.client_name && { label: "Client", value: project.client_name },
    project.location && { label: "Location", value: project.location },
    project.category && { label: "Category", value: project.category },
    project.completion_date && { label: "Completed", value: formatDate(project.completion_date) },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <section className="border-b border-white/[0.06] pt-28 sm:pt-32">
        <div className="container-x pb-12">
          <Breadcrumbs items={crumbs} />
          <div className="grid gap-10 lg:grid-cols-2">
            <Media
              src={project.featured_image}
              alt={project.title}
              seed={project.slug}
              icon="🏗️"
              priority
              className="aspect-[4/3] w-full rounded-brand border border-white/[0.06]"
            />
            <div>
              {project.category ? <span className="chip">{project.category}</span> : null}
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-content sm:text-4xl">
                {project.title}
              </h1>
              <p className="mt-4 text-content-muted">{project.description}</p>

              {facts.length > 0 && (
                <dl className="mt-6 grid grid-cols-2 gap-4">
                  {facts.map((f) => (
                    <div key={f.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                      <dt className="text-xs uppercase tracking-wider text-content-muted">{f.label}</dt>
                      <dd className="mt-1 text-sm font-semibold text-content">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <Link href="/contact" className="btn-primary mt-7">
                Start a similar project
              </Link>
            </div>
          </div>

          {project.before_image && project.after_image ? (
            <div className="mt-12">
              <h2 className="mb-4 text-xl font-bold text-content">Before &amp; after</h2>
              <BeforeAfter before={project.before_image} after={project.after_image} alt={project.title} />
            </div>
          ) : null}

          {project.videos?.length ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {project.videos.map((v, i) => (
                <VideoEmbed key={i} src={v} title={`${project.title} — video ${i + 1}`} />
              ))}
            </div>
          ) : null}

          {project.gallery?.length ? (
            <div className="mt-12">
              <h2 className="mb-4 text-xl font-bold text-content">Project gallery</h2>
              <Gallery images={project.gallery} alt={project.title} />
            </div>
          ) : null}
        </div>
      </section>

      {related.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeading eyebrow="More work" title="Related projects" align="left" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} index={i}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
