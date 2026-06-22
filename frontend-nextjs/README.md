# Prime Tech — Next.js Frontend

A modern, production-ready marketing website for Prime Tech (CCTV, networking, fiber optic,
access control, biometrics, IT & security solutions). Built with Next.js 15 (App Router),
TypeScript, Tailwind CSS, Framer Motion, TanStack Query and Axios, wired to the existing
Django + DRF backend.

## Quick start

```bash
# 1. Backend must be running and seeded (see repo root README / ARCHITECTURE.md)
#    API expected at http://127.0.0.1:8000/api/v1/

# 2. Install + configure
cd frontend-nextjs
npm install
cp .env.example .env.local   # adjust URLs if needed

# 3. Develop
npm run dev                  # http://localhost:3000

# 4. Production
npm run build && npm run start
```

## Environment

| Variable | Purpose |
|---|---|
| `API_BASE_URL` | Server-side (RSC) API base — internal network in prod |
| `NEXT_PUBLIC_API_BASE_URL` | Client-side API base — browser-reachable |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin (sitemap, OG, canonical) |
| `NEXT_PUBLIC_BACKEND_HOST` | Host allowed for `next/image` remote images |

## Architecture

- **Server Components** fetch data via `src/lib/api.ts` (native `fetch` + ISR `revalidate`)
  and the typed accessors in `src/lib/data.ts`. This gives SSG/ISR, fast first paint and SEO.
- **Client Components** (`"use client"`) handle interactivity: nav, filters (`Explorer`),
  galleries/lightbox, before/after slider, animated counters, and the contact form
  (`TanStack Query` + Axios → `POST /crm/public/leads/`).
- **Content is backend-driven**: site settings, homepage section content/order, services,
  products, portfolio, blog, testimonials and per-route SEO all come from the API. No business
  content is hard-coded (legal pages are static prose by design).
- **Images**: backend image fields may be empty; `<Media>` renders `next/image` when a real
  URL exists, otherwise a branded gradient/icon fallback — so the UI never shows broken images.

## Pages

Home · About · Services (+ detail) · Products (+ detail) · Portfolio (+ detail) ·
Blog (+ detail) · Contact · Privacy · Terms · 404. Plus `sitemap.xml`, `robots.txt`,
dynamic `opengraph-image`, favicon and web manifest.

## SEO

Per-route metadata merged from CMS `SeoSetting` → `SiteSetting` → page overrides
(`src/lib/seo.ts`); Open Graph + Twitter cards; JSON-LD structured data (LocalBusiness,
Breadcrumb, Service, Product, BlogPosting, FAQ — `src/lib/schema.ts`); canonical URLs;
dynamic sitemap and robots.

## Quality

`npm run build`, `npm run lint`, and `npm run typecheck` all pass clean. Accessibility:
semantic landmarks, skip-link, focus-visible rings, `aria` labels, and `prefers-reduced-motion`
support.
