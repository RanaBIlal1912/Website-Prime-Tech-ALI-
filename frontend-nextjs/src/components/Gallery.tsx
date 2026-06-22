"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { resolveImage } from "@/lib/utils";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const resolved = images.map(resolveImage).filter((u): u is string => Boolean(u));
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? null : (i + 1) % resolved.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? null : (i - 1 + resolved.length) % resolved.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, resolved.length]);

  if (resolved.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {resolved.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.06] focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={url}
              alt={`${alt} — image ${i + 1}`}
              fill
              sizes="(max-width:768px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white"
              aria-label="Close"
            >
              ✕
            </button>
            <motion.div
              key={open}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative h-[80vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={resolved[open]}
                alt={`${alt} — image ${open + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
