"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { HeroConfig } from "@/lib/types";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] as const },
});

export function Hero({ config, tagline }: { config: HeroConfig; tagline: string }) {
  const primary = config.primary_cta ?? { label: "Get a Free Quote", href: "/contact" };
  const secondary = config.secondary_cta;

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      {/* Ambient mesh + grid backdrop (design-system fallback for the legacy hero video) */}
      <div className="absolute inset-0 bg-hero-mesh" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(70% 70% at 50% 30%, #000 0%, transparent 80%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />

      <div className="container-x relative pt-28 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          {config.badge ? (
            <motion.span
              {...fade(0)}
              className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 text-xs font-medium text-content"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              {config.badge}
            </motion.span>
          ) : null}

          <motion.h1
            {...fade(0.1)}
            className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-content sm:text-6xl"
          >
            {config.title || "Enterprise Security & IT Infrastructure"}
            {config.highlight ? (
              <span className="mt-2 block gradient-text">{config.highlight}</span>
            ) : null}
          </motion.h1>

          <motion.p {...fade(0.2)} className="mx-auto mt-6 max-w-2xl text-base text-content-muted sm:text-lg">
            {config.subtitle || tagline}
          </motion.p>

          <motion.div {...fade(0.3)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href={primary.href} className="btn-primary">
              {primary.label}
            </Link>
            {secondary ? (
              <Link href={secondary.href} className="btn-ghost">
                {secondary.label}
              </Link>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
