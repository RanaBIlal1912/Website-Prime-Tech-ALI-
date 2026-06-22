import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { BRAND_FALLBACK } from "@/lib/site";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/terms",
    title: "Terms & Conditions",
    description: "The terms governing your use of the Prime Tech website and services.",
  });
}

export default async function TermsPage() {
  const settings = await getSiteSettings();
  const brand = settings?.site_title || BRAND_FALLBACK.site_title;
  const email = settings?.email || BRAND_FALLBACK.email;

  return (
    <LegalLayout
      title="Terms & Conditions"
      updated="June 2026"
      path="/terms"
      intro={`These terms govern your use of the ${brand} website and the services we provide. By using this website or engaging our services, you agree to these terms.`}
      sections={[
        {
          heading: "Services",
          body: [
            `${brand} provides CCTV, networking, fiber optic, access control, biometric and related IT and security solutions. Specific deliverables, timelines and pricing are defined in the written quotation issued for each project.`,
          ],
        },
        {
          heading: "Quotations & pricing",
          body: [
            "Quotations are valid for the period stated on the document. Prices are subject to change for orders placed after a quotation expires, and may vary with equipment availability and site conditions.",
          ],
        },
        {
          heading: "Warranty & support",
          body: [
            "Equipment is covered by the applicable manufacturer warranty. Installation workmanship is warranted as stated in your project agreement. Annual maintenance contracts (AMC) are available for ongoing support.",
          ],
        },
        {
          heading: "Client responsibilities",
          body: [
            "Clients are responsible for providing safe site access, power, and any permissions required for installation. Delays caused by site readiness may affect timelines.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "While we design systems to high standards, no security system can guarantee against all risks. Our liability is limited to the value of the services provided, to the extent permitted by law.",
          ],
        },
        {
          heading: "Intellectual property",
          body: [
            "All content on this website, including text, graphics and logos, is the property of the company and may not be reproduced without permission.",
          ],
        },
        {
          heading: "Contact",
          body: [`For questions about these terms, contact us at ${email}.`],
        },
      ]}
    />
  );
}
