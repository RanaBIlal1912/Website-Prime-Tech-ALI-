import Link from "next/link";
import { Media } from "./Media";
import type { BlogPost, Product, Project, Service, Testimonial } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function ServiceCard({ service, href }: { service: Service; href?: string }) {
  return (
    <Link href={href ?? `/services/${service.slug}`} className="card group flex h-full flex-col overflow-hidden">
      <Media
        src={service.featured_image}
        alt={service.title}
        seed={service.slug}
        icon={service.icon || "🛡️"}
        className="aspect-[16/10] w-full"
      />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-content transition-colors group-hover:text-primary">
          {service.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-content-muted">{service.short_desc}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Learn more <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="card group flex flex-col overflow-hidden">
      <div className="relative">
        <Media
          src={product.featured_image}
          alt={product.name}
          seed={product.slug}
          icon="📦"
          className="aspect-square w-full"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-brand-gradient px-3 py-1 text-xs font-bold text-ink">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {product.category_name ? (
          <span className="text-xs font-medium uppercase tracking-wider text-content-muted">
            {product.category_name}
          </span>
        ) : null}
        <h3 className="mt-1 font-bold text-content transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold text-accent">{product.price_label || "Request price"}</span>
          <span className="text-xs text-content-muted">
            {product.stock_status === "in_stock"
              ? "In stock"
              : product.stock_status === "order"
                ? "On order"
                : "Out of stock"}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="card group flex flex-col overflow-hidden">
      <Media
        src={project.featured_image}
        alt={project.title}
        seed={project.slug}
        icon="🏗️"
        className="aspect-[16/10] w-full"
      />
      <div className="flex flex-1 flex-col p-6">
        {project.category ? <span className="chip self-start">{project.category}</span> : null}
        <h3 className="mt-3 text-lg font-bold text-content transition-colors group-hover:text-primary">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-content-muted">{project.description}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-content-muted">
          {project.client_name ? <span>{project.client_name}</span> : null}
          {project.location ? <span>· {project.location}</span> : null}
        </div>
      </div>
    </Link>
  );
}

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card group flex flex-col overflow-hidden">
      <Media
        src={post.featured_image}
        alt={post.title}
        seed={post.slug}
        icon="📝"
        className="aspect-[16/9] w-full"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs text-content-muted">
          {post.category_name ? <span className="text-primary">{post.category_name}</span> : null}
          {post.published_at ? <span>· {formatDate(post.published_at)}</span> : null}
        </div>
        <h3 className="mt-2 text-lg font-bold leading-snug text-content transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-content-muted">{post.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          Read article <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="card flex h-full flex-col p-7">
      <div className="mb-3 flex gap-0.5 text-accent" aria-label={`${testimonial.rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} aria-hidden className={i < testimonial.rating ? "" : "opacity-25"}>
            ★
          </span>
        ))}
      </div>
      <blockquote className="flex-1 text-content-muted">&ldquo;{testimonial.body}&rdquo;</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-gradient text-sm font-bold text-ink">
          {testimonial.name.charAt(0)}
        </span>
        <span>
          <span className="block text-sm font-semibold text-content">{testimonial.name}</span>
          {testimonial.role ? (
            <span className="block text-xs text-content-muted">{testimonial.role}</span>
          ) : null}
        </span>
      </figcaption>
    </figure>
  );
}
