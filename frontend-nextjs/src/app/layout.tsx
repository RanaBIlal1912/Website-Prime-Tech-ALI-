import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { getSiteSettings } from "@/lib/data";
import { BRAND_FALLBACK, SITE_URL } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#060608",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings?.site_title || BRAND_FALLBACK.site_title;
  const tagline = settings?.tagline || BRAND_FALLBACK.tagline;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${title} — ${tagline}`, template: `%s | ${title}` },
    description: settings?.company_desc || BRAND_FALLBACK.company_desc,
    applicationName: title,
    formatDetection: { telephone: true },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const title = settings?.site_title || BRAND_FALLBACK.site_title;
  const phone = settings?.phone || BRAND_FALLBACK.phone;
  const whatsapp = settings?.whatsapp || BRAND_FALLBACK.whatsapp;

  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-ink"
          >
            Skip to content
          </a>
          <Navbar siteTitle={title} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer settings={settings} />
          <FloatingActions phone={phone} whatsapp={whatsapp} />
        </Providers>
      </body>
    </html>
  );
}
