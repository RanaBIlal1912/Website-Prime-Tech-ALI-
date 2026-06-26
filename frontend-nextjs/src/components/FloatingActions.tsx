"use client";

import Link from "next/link";
import { telLink, whatsappLink } from "@/lib/site";

interface Props {
  phone: string;
  whatsapp: string;
}

/** Fixed quick-action buttons (quote / call / WhatsApp) — mirrors the legacy site. */
export function FloatingActions({ phone, whatsapp }: Props) {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <Link
        href="/contact"
        className="group grid h-12 w-12 place-items-center rounded-full bg-brand-gradient text-ink shadow-glow transition-transform hover:-translate-y-0.5"
        aria-label="Get a quote"
        title="Get a quote"
      >
        <span className="text-lg" aria-hidden>📋</span>
      </Link>
      {phone && (
        <a
          href={telLink(phone)}
          className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-ink-card text-content shadow-card transition-transform hover:-translate-y-0.5"
          aria-label="Call us"
          title="Call us"
        >
          <span className="text-lg" aria-hidden>📞</span>
        </a>
      )}
      {whatsapp && (
        <a
          href={whatsappLink(whatsapp, "Hello Prime Tech, I'd like a quote.")}
          target="_blank"
          rel="noopener noreferrer"
          className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-card animate-pulse-green transition-transform hover:-translate-y-0.5"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
        >
          <span className="text-lg" aria-hidden>💬</span>
        </a>
      )}
    </div>
  );
}
