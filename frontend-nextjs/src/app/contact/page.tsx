import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, organizationSchema } from "@/lib/schema";
import { BRAND_FALLBACK, telLink, whatsappLink } from "@/lib/site";
import { PAGE_HEROES } from "@/lib/hero-images";

export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/contact" });
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const [{ service }, settings] = await Promise.all([searchParams, getSiteSettings()]);
  const phone = settings?.phone || BRAND_FALLBACK.phone;
  const email = settings?.email || BRAND_FALLBACK.email;
  const address = settings?.address || BRAND_FALLBACK.address;
  const whatsapp = settings?.whatsapp || BRAND_FALLBACK.whatsapp;
  const mapEmbed = settings?.map_embed;

  const details = [
    { icon: "📍", label: "Visit us", value: address },
    { icon: "📞", label: "Call us", value: phone, href: telLink(phone) },
    { icon: "✉️", label: "Email us", value: email, href: `mailto:${email}` },
    {
      icon: "💬",
      label: "WhatsApp",
      value: "Chat with our team",
      href: whatsappLink(whatsapp, "Hello Prime Tech, I'd like a quote."),
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          organizationSchema(settings),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Contact"
        title="Let's secure your premises"
        subtitle="Tell us what you need — CCTV, networking, access control or a full survey. We'll get back to you within one business day."
        image={PAGE_HEROES.contact}
      />

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm defaultService={service} />
          </div>

          <div className="space-y-4 lg:col-span-2">
            {details.map((d) => (
              <div key={d.label} className="card flex items-start gap-4 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-xl" aria-hidden>
                  {d.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-content">{d.label}</p>
                  {d.href ? (
                    <a
                      href={d.href}
                      target={d.href.startsWith("http") ? "_blank" : undefined}
                      rel={d.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-content-muted transition-colors hover:text-primary"
                    >
                      {d.value}
                    </a>
                  ) : (
                    <p className="text-sm text-content-muted">{d.value}</p>
                  )}
                </div>
              </div>
            ))}

            {mapEmbed ? (
              <div className="card overflow-hidden">
                <iframe
                  src={mapEmbed}
                  title="Prime Tech location"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-64 w-full border-0"
                />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
