import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { getSiteSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { BRAND_FALLBACK } from "@/lib/site";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/privacy",
    title: "Privacy Policy",
    description: "How Prime Tech collects, uses and protects your personal information.",
  });
}

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  const brand = settings?.site_title || BRAND_FALLBACK.site_title;
  const email = settings?.email || BRAND_FALLBACK.email;

  return (
    <LegalLayout
      title="Privacy Policy"
      updated="June 2026"
      path="/privacy"
      intro={`${brand} ("we", "us") respects your privacy. This policy explains what information we collect when you use our website or contact us, and how we use and protect it.`}
      sections={[
        {
          heading: "Information we collect",
          body: [
            "When you submit an enquiry or quote request, we collect the details you provide — such as your name, email address, phone number, company, city and the message you send.",
            "We may also collect standard technical data (such as browser type and pages visited) to improve our website and security.",
          ],
        },
        {
          heading: "How we use your information",
          body: [
            "We use your information solely to respond to your enquiry, prepare quotations, deliver our services, and keep you informed about your project.",
            "We do not sell your personal information to third parties.",
          ],
        },
        {
          heading: "Data storage & security",
          body: [
            "Enquiries are stored securely in our customer-relationship system with access restricted to authorised staff. We apply appropriate technical and organisational measures to protect your data.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "Our website uses only essential cookies required for the site to function. We do not use intrusive third-party advertising trackers.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "You may request access to, correction of, or deletion of the personal information we hold about you at any time.",
            `To exercise these rights, contact us at ${email}.`,
          ],
        },
        {
          heading: "Contact",
          body: [`If you have questions about this policy, please email us at ${email}.`],
        },
      ]}
    />
  );
}
