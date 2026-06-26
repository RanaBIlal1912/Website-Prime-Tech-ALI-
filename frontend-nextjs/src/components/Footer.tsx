import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { BRAND_FALLBACK, NAV_LINKS, telLink, whatsappLink } from "@/lib/site";

const socials: Array<{ key: keyof SiteSettings; label: string }> = [
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "youtube", label: "YouTube" },
  { key: "tiktok", label: "TikTok" },
];

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const s = settings;
  const title = s?.site_title || BRAND_FALLBACK.site_title;
  const desc = s?.company_desc || BRAND_FALLBACK.company_desc;
  const phone = s?.phone || BRAND_FALLBACK.phone;
  const email = s?.email || BRAND_FALLBACK.email;
  const address = s?.address || BRAND_FALLBACK.address;
  const whatsapp = s?.whatsapp || BRAND_FALLBACK.whatsapp;
  const footerText = s?.footer_text || BRAND_FALLBACK.footer_text;
  const activeSocials = socials.filter((soc) => s && (s[soc.key] as string));

  return (
    <footer className="relative mt-24 border-t border-white/[0.06] bg-ink-card/40">
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-base font-black text-ink">
              P
            </span>
            <span className="text-lg font-extrabold text-content">{title}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-content-muted">{desc}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-content">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-content-muted transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-content">Legal</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/privacy" className="text-content-muted transition-colors hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-content-muted transition-colors hover:text-primary">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-content">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-content-muted">
            <li className="leading-relaxed">{address}</li>
            <li>
              <a href={telLink(phone)} className="transition-colors hover:text-primary">
                {phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="transition-colors hover:text-primary">
                {email}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                WhatsApp
              </a>
            </li>
          </ul>
          {activeSocials.length > 0 && (
            <div className="mt-4 flex gap-3">
              {activeSocials.map((soc) => (
                <a
                  key={soc.key}
                  href={s![soc.key] as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-content-muted hover:text-primary"
                >
                  {soc.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-content-muted sm:flex-row">
          <p>{footerText}</p>
          <p>Designed &amp; built for enterprise reliability.</p>
        </div>
      </div>
    </footer>
  );
}
