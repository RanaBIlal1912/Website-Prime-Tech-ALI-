import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import type { CtaSectionConfig, IconTextItem, IndustryItem } from "@/lib/types";

export function WhyUs({ items, subtitle }: { items: IconTextItem[]; subtitle?: string }) {
  if (!items?.length) return null;
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading eyebrow="Why Prime Tech" title="A partner you can rely on" subtitle={subtitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={i} index={i} className="card p-7">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/[0.04] text-2xl" aria-hidden>
                {item.icon}
              </div>
              <h3 className="mt-4 font-bold text-content">{item.title}</h3>
              <p className="mt-2 text-sm text-content-muted">{item.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IndustriesStrip({ items, subtitle }: { items: IndustryItem[]; subtitle?: string }) {
  if (!items?.length) return null;
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeading eyebrow="Industries We Serve" title="Trusted across sectors" subtitle={subtitle} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item, i) => (
            <Reveal key={i} index={i} className="glass flex flex-col items-center gap-3 rounded-brand p-6 text-center">
              <span className="text-3xl" aria-hidden>
                {item.icon}
              </span>
              <span className="text-sm font-medium text-content">{item.name}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBanner({ config }: { config: CtaSectionConfig }) {
  const cta = config.primary_cta ?? { label: "Get Started", href: "/contact" };
  return (
    <section className="section">
      <div className="container-x">
        <Reveal className="relative overflow-hidden rounded-brand border border-primary/20 bg-hero-mesh px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-content sm:text-4xl">
              {config.title || "Ready to Secure Your Business?"}
            </h2>
            {config.subtitle ? <p className="mt-4 text-content-muted">{config.subtitle}</p> : null}
            <Link href={cta.href} className="btn-primary mt-8">
              {cta.label}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
