"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar({ siteTitle }: { siteTitle: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/[0.06] bg-ink/70 backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent",
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between sm:h-[72px]" aria-label="Primary">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${siteTitle} home`}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-base font-black text-ink shadow-glow">
            P
          </span>
          <span className="text-lg font-extrabold tracking-tight text-content">{siteTitle}</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive(l.href) ? "text-content" : "text-content-muted hover:text-content",
                )}
              >
                {l.label}
                {isActive(l.href) && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-primary to-accent shadow-glow"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Link href="/contact" className="btn-primary btn-sm">
            Get a Quote
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-content lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="relative block h-4 w-5">
            <span className={cn("absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform", open && "translate-y-[7px] rotate-45")} />
            <span className={cn("absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-opacity", open && "opacity-0")} />
            <span className={cn("absolute left-0 top-[14px] h-0.5 w-5 bg-current transition-transform", open && "-translate-y-[7px] -rotate-45")} />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-white/[0.06] bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="container-x flex flex-col gap-1 py-4">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "block rounded-lg px-4 py-3 text-sm font-medium",
                      isActive(l.href) ? "bg-white/[0.05] text-content" : "text-content-muted",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 px-1">
                <Link href="/contact" className="btn-primary btn-sm w-full">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
