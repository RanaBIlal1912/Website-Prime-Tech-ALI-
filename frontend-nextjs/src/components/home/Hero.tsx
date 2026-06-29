"use client";

import { useEffect, useState } from "react";
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
  /** Background image slideshow (1+ images). Cycles with a crossfade. */
  images?: string[];
  /** Optional background video URL — overrides the image slideshow when set. */
  videoUrl?: string | null;
  /** Dark overlay strength over the media, 0–1. */
  overlayOpacity?: number;
  /** Seconds between slides. */
  interval?: number;
}

export function Hero({ config, tagline, images = [], videoUrl, overlayOpacity = 0.6, interval = 5 }: HeroProps) {
  const primary = config.primary_cta ?? { label: "Get a Free Quote", href: "/contact" };
  const secondary = config.secondary_cta;
  const slides = images.filter(Boolean);
  const [index, setIndex] = useState(0);

  // Auto-advance the slideshow, unless there's a video, only one image, or the
  // user prefers reduced motion.
  useEffect(() => {
    if (videoUrl || slides.length <= 1) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), interval * 1000);
    return () => window.clearInterval(id);
  }, [videoUrl, slides.length, interval]);

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      {/* Background media: video overrides; otherwise an image slideshow; else mesh. */}
      {videoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={slides[0]}
          aria-hidden
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : slides.length > 0 ? (
        slides.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            aria-hidden
          >
            <Image src={src} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
          </motion.div>
        ))
      ) : (
        <div className="absolute inset-0 bg-hero-mesh" aria-hidden />
      )}

      {/* Readability overlays tuned for white text on a photo */}
      <div className="absolute inset-0 bg-ink" style={{ opacity: overlayOpacity }} aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink" aria-hidden />
      <div className="absolute inset-0 bg-hero-mesh opacity-40 mix-blend-screen" aria-hidden />

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
            {config.highlight ? <span className="mt-2 block gradient-text">{config.highlight}</span> : null}
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

          {/* Slide indicators */}
          {!videoUrl && slides.length > 1 ? (
            <div className="mt-10 flex items-center justify-center gap-2" role="tablist" aria-label="Hero slides">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === index ? "w-7 bg-primary" : "w-2.5 bg-white/30 hover:bg-white/50"}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" aria-hidden />
    </section>
  );
}
