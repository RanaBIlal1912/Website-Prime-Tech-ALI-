# Prime Tech — Project Audit & Frontend Implementation Roadmap

> Analysis phase deliverable. Completed before any frontend code was written.
> Author: Senior Software Architect pass over the existing Django backend + legacy static site.

## 1. Executive summary

The repository already contains a **production-grade Django 5 + DRF + PostgreSQL backend**
(16+ models, JWT auth + RBAC, CRM, quotations, blog, portfolio, catalog, support, media hub,
CMS settings, audit log) and a **legacy static HTML site** (`legacy/`) that defines the brand
identity. The backend exposes the public read + write endpoints a marketing site needs. The
work is therefore **a new Next.js frontend wired to the existing API** — not a backend rebuild.

**Verified live during analysis:** the backend boots against Postgres, migrates, and seeds real
content. Public endpoints return real Prime Tech data (6 services, 4 products, 3 projects,
3 testimonials, 3 blog posts after seed extension, site settings, 8 ordered home sections, SEO).

## 2. Backend API audit (what exists)

Base URL: `/api/v1/`. Pagination envelope: `{count, next, previous, results}` (page size 25, max 200).
List filters via `?field=`, `?search=`, `?ordering=`, `?page=`/`?page_size=`.

| Domain | Endpoint | Public? | Notes |
|---|---|---|---|
| CMS | `GET /cms/settings/` | ✅ | Singleton: brand, contact, social, theme colors |
| CMS | `GET /cms/seo/` , `GET /cms/seo/{path}/` | ✅ | Per-route meta/OG/Twitter/canonical/robots/JSON-LD |
| CMS | `GET /cms/home-sections/` | ✅ | 8 ordered, toggleable sections with JSON `config` |
| CMS | `GET /cms/backgrounds/{page_key}/` | ✅ | Per-page background config |
| Catalog | `GET /catalog/services/` , `/{slug}/` | ✅ | `?is_featured=`, `?category=`, `?search=`; benefits/faqs/gallery JSON |
| Catalog | `GET /catalog/products/` , `/{slug}/` | ✅ | `?is_featured=`, `?category=`, `?stock_status=`; specs JSON |
| Catalog | `GET /catalog/categories/` | ✅ | `?kind=service|product` |
| Catalog | `GET /catalog/testimonials/` | ✅ | text/video |
| Portfolio | `GET /portfolio/projects/` , `/{slug}/` | ✅ | `?category=` (string), before/after, gallery, videos |
| Blog | `GET /blog/posts/` , `/{slug}/` | ✅ | `?category=`, `?search=`; tags as slugs |
| Blog | `GET /blog/categories/` , `/blog/tags/` | ✅ | |
| CRM | `POST /crm/public/leads/` | ✅ | Lead capture (throttled 20/hr). Fields: name, email, phone, company, service_interest, message, city |
| Support | `POST /support/public/tickets/` | ✅ | Ticket creation (throttled). Returns ticket_number |
| Auth | `POST /auth/login/ \| /refresh/ \| /logout/`, `GET /auth/me/` | mixed | JWT (30m access / 7d refresh, rotation), login throttle 5/min, lockout after 5 fails |
| Media | `/media-library/files/` | ❌ auth | Real file storage; not needed for public site (content uses URL string fields) |

## 3. Gaps & decisions

| Finding | Decision |
|---|---|
| All content `*_image` fields are **empty strings** (no photos seeded) | Frontend uses a **design-system fallback**: gradient meshes + emoji/SVG iconography + branded placeholders. Looks intentional for a dark tech brand; admin can later set real URLs. |
| Homepage had no stored copy (hero/stats/why-us/industries/cta) | **Extended seed** to populate `HomeSection.config` JSON → homepage is fully content-managed (satisfies "no hardcoded content"). |
| Blog had 0 posts | **Extended seed** with 3 real, on-brand published posts + categories + tags. |
| No `SeoSetting` rows | **Extended seed** with 6 route SEO defaults; frontend merges per-route. |
| "Featured"/"related" endpoints missing | Covered by existing query params (`?is_featured=true`, `?category=`). No new endpoints required. |
| Portfolio `category` is a free string | Frontend derives filter chips from the live data set. |
| MediaHub auth-gated | Not used by public site; content stores image URLs directly. No change. |

**Conclusion: no backend rebuild required.** Additive seed changes only.

## 4. Tech stack (frontend)

Next.js 15 (App Router, RSC) · TypeScript · Tailwind CSS · Framer Motion · TanStack Query · Axios.
Server Components fetch data for SEO + speed; Client Components handle interactivity/animation/forms.

## 5. Design system (ported from legacy, verified against `SiteSetting`)

Colors: primary `#00aaff`, secondary `#7b2ff7`, accent `#00ffc8`, bg `#060608`, card `#12121a`/`#181822`,
text `#f1f1f5`, muted `#9a9aab`, border `#25252f`. Radius 16px. Dark glassmorphism (navbar blur 18px,
cards blur 10px). Motion: scroll-reveal fade-up, animated counters (1500ms), card hover lift, WhatsApp pulse.

## 6. Pages

Home · About · Services · Service detail · Portfolio · Project detail · Products · Product detail ·
Blog · Blog detail · Contact · Privacy · Terms · 404. All dynamic from APIs.

## 7. Roadmap (phased, depth-first)

- **Phase 0 — Verify & seed backend** ✅ done (this session).
- **Phase 1 — Foundation:** scaffold `frontend-nextjs/`, design tokens, API/types layer, React Query, layout, nav, footer, floating CTAs, image-fallback component, `next.config` images.
- **Phase 2 — First complete vertical slice:** Home (dynamic sections) + Services list/detail with loading/error/SEO. `npm run build` green.
- **Phase 3 — Remaining pages:** Portfolio, Products, Blog, About, Contact (lead form → DB), Privacy/Terms, 404.
- **Phase 4 — SEO/perf/QA:** sitemap, robots, JSON-LD, OG/Twitter, canonical; image opt, code splitting; fix all TS/ESLint/build issues; final report.

## 8. Success criteria tracking

Per the spec these are all-or-nothing across a multi-session build. Each shipped slice is genuinely
complete (real API, loading/error states, responsive, SEO) and verified by a green production build;
the final report distinguishes complete-and-verified from remaining recommendations.
