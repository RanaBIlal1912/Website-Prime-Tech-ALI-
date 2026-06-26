// Small shared UI primitives used across pages.
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-primary",
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-hero-mesh pt-28 sm:pt-32">
      <div className="container-x pb-14 pt-6 text-center sm:pb-16">
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-content sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-2xl text-content-muted">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="card mx-auto max-w-md p-10 text-center">
      <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-white/[0.04] text-2xl">
        📭
      </div>
      <p className="font-semibold text-content">{title}</p>
      {hint ? <p className="mt-2 text-sm text-content-muted">{hint}</p> : null}
      <Link href="/contact" className="btn-primary btn-sm mt-6">
        Contact us
      </Link>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-[16/10] animate-pulse bg-white/[0.04]" />
          <div className="space-y-3 p-6">
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-3 w-full animate-pulse rounded bg-white/[0.04]" />
            <div className="h-3 w-4/5 animate-pulse rounded bg-white/[0.04]" />
          </div>
        </div>
      ))}
    </div>
  );
}
