"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { HeroConfig } from "@/lib/types";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] as const },
});

interface HeroProps {
  config: HeroConfig;
  tagline: string;
  /** Background image URL (backend-managed; falls back to the bundled asset). */
  imageUrl?: string | null;
  /** Optional background video URL — overrides the image when set. */
  videoUrl?: string | null;
  /** Dark overlay strength over the media, 0–1. */
  overlayOpacity?: number;
}

export function Hero({ config, tagline, imageUrl, videoUrl, overlayOpacity = 0.6 }: HeroProps) {
  const primary = config.primary_cta ?? { label: "Get a Free Quote", href: "/contact" };
  const secondary = config.secondary_cta;

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      {/* Background media: optional video overrides the image; image is the default. */}
      {videoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={imageUrl || undefined}
          aria-hidden
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : null}

      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover ${videoUrl ? "motion-reduce:block hidden" : ""}`}
          aria-hidden
        />
      ) : (
        <div className="absolute inset-0 bg-hero-mesh" aria-hidden />
      )}

      {/* Readability overlays tuned for white text on a photo */}
      <div className="absolute inset-0 bg-ink" style={{ opacity: overlayOpacity }} aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" aria-hidden />
      <div className="absolute inset-0 bg-hero-mesh opacity-50 mix-blend-screen" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" aria-hidden />

      <div className="container-x relative pt-28 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          {config.badge ? (
            <motion.span
              {...fade(0)}
              className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 text-xs font-medium text-content backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
              {config.badge}
            </motion.span>
          ) : null}

          <motion.h1
            {...fade(0.1)}
            className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-content drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] sm:text-6xl"
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
