# Prime Tech — Architecture & Build Plan

> **Prime Tech — _Your Security, Our Priority_**
> Security Systems · CCTV · IT Services · Networking · Biometrics · Access Control · Structured Cabling · Smart Security — Bahawalpur, Pakistan.

This document is the durable source of truth for the platform architecture and the
phased build. It is committed to the repo so any contributor (or a future session)
can pick up exactly where things stand.

---

## 1. Where we started

The original repository was a **static marketing site** (12 files, ~1,800 LOC):

- Pure HTML/CSS/JS, branded **"SecureNet"**.
- A **dark, glassmorphic design system** (`#00aaff` / `#7b2ff7` / `#00ffc8`, blur navbar,
  hero video, scroll-reveal, animated counters).
- **`localStorage` used as a database** (`assets/js/data.js → DEFAULT_DATA`) and a
  **client-side "admin" with fake login** (`legacy/admin/`).

The static site is preserved verbatim under [`legacy/`](./legacy) as a content & design reference.

### What is "preserved" vs. "rebuilt"

Moving from static-HTML + `localStorage` to **Next.js + Django + PostgreSQL** is a
**rebuild**, not a refactor — there is no server code to keep. We deliberately preserve:

1. **The design system** — the colour tokens, dark theme, glassmorphism, and motion language
   are ported into the frontend Tailwind config (the real "brand identity").
2. **The content** — the `DEFAULT_DATA` shapes (services, products+specs, portfolio with
   before/after, statistics, the Bahawalpur locale) become **database seed data**
   (`backend/apps/core/seed.py`).
3. **Rename** `SecureNet → Prime Tech` everywhere (visual identity unchanged; only the name).

### Honest scope statement

The full spec is **multi-session work**. The operative reading of *"no placeholders /
no fake auth / no localStorage-as-DB / no unfinished modules"* is:

> **Everything actually shipped is real and complete, and we ship in coherent phases.**

Spraying hundreds of stub files would itself violate "no unfinished modules". So each
phase delivers fully-working, migrated, tested capability.

---

## 2. Repository layout

```
.
├── ARCHITECTURE.md          # this file
├── README.md                # quickstart + deploy + security + testing report
├── docker-compose.yml       # postgres + backend + nginx (frontend added in its phase)
├── .env.example             # root compose env
├── legacy/                  # original static site (reference only)
├── backend/                 # Django + DRF + PostgreSQL  ← current focus
│   ├── config/              # project: split settings, urls, wsgi/asgi
│   │   └── settings/        # base.py / dev.py / prod.py
│   ├── apps/
│   │   ├── core/            # shared base models, Settings, PageBackground, seed
│   │   ├── accounts/        # User, Role, Permission, JWT, RBAC
│   │   ├── crm/             # Customer, Lead, Note, FollowUp, Activity
│   │   ├── catalog/         # Service, Product, Category, Testimonial
│   │   ├── portfolio/       # Project (gallery, before/after, video)
│   │   ├── blog/            # Post, Category, Tag
│   │   ├── support/         # Ticket, TicketReply
│   │   ├── quotations/      # Quotation, QuotationItem (+ PDF export)
│   │   ├── mediahub/        # MediaFile, MediaFolder (multi-storage ready)
│   │   └── audit/           # AuditLog
│   ├── requirements.txt
│   ├── Dockerfile
│   └── manage.py
└── frontend/                # Next.js + TS + Tailwind  (later phase)
```

---

## 3. Tech stack

| Layer        | Choice |
|--------------|--------|
| Frontend     | Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion |
| Backend      | Python · Django 5 · Django REST Framework |
| Database     | PostgreSQL 16 |
| Auth         | JWT access + refresh (`djangorestframework-simplejwt`), role-based access control, login throttling, 2FA-ready |
| API docs     | OpenAPI 3 via `drf-spectacular` (`/api/schema`, `/api/docs`) |
| Media        | Pluggable storage backend (Local now; S3 / R2 / GCS / Spaces / Azure ready via `django-storages`) |
| PDF          | ReportLab (quotation export) |
| Deploy       | Docker · docker-compose · Nginx · SSL-ready · 12-factor env config |

---

## 4. Domain model (16 + entities)

```
accounts:   User ─┬─< Role >─┬─ Permission (codename, module, action)
                  └ (RBAC: role.permissions = set of codenames)

crm:        Customer 1──< Lead >──┬──< LeadNote
                                  ├──< FollowUp
                                  └──< Activity (timeline)
            Lead.source  ∈ {website, whatsapp, phone, referral, facebook, google}
            Lead.status  ∈ {new, contacted, quotation_sent, negotiation, won, lost}

catalog:    Category 1──< Service ; Category 1──< Product ;  Testimonial
portfolio:  Project (images, videos, before/after, client, location, completion_date)
blog:       Category 1──< Post >──< Tag  (draft/publish, SEO fields)
support:    Ticket >──< TicketReply ; status ∈ {open,in_progress,pending,completed,closed}
quotations: Quotation 1──< QuotationItem  (auto number, tax, discount, PDF)
mediahub:   MediaFolder 1──< MediaFile  (image/video/doc, usage tracking)
core:       SiteSetting (singleton) ; PageBackground (per-page bg config) ; SeoSetting
audit:      AuditLog (actor, action, target, ip, changes, ts)
```

Every business model inherits `core.TimeStampedModel` (uuid pk, created/updated, soft-delete-ready).

---

## 5. Roles & permissions (RBAC)

Seeded roles, each a configurable set of permission codenames (`<module>.<action>`):

| Role            | Scope |
|-----------------|-------|
| Super Admin     | all permissions |
| Sales Manager   | crm.*, customers.*, quotations.*, leads.*, read portfolio/catalog |
| Support Manager | support.*, customers.read, read catalog |
| Content Manager | blog.*, catalog.*, portfolio.*, mediahub.*, testimonials.*, cms.* |
| Technician      | support.read/update (assigned), projects.read |

Permissions are data, not code — editable from the admin module at runtime.

---

## 6. Build phases & status

| # | Phase | Status |
|---|-------|--------|
| 1 | Repo layout, ARCHITECTURE, legacy archived | **done** |
| 2 | Django project, split settings, security middleware | **this session** |
| 3 | accounts: User/Role/Permission, JWT+refresh, RBAC, throttling | **this session** |
| 4 | All 16 domain models + migrations on Postgres | **this session** |
| 5 | CRM + Quotations full vertical slice (secured API + PDF) | **this session** |
| 6 | Seed data from legacy, audit logging, API verified | **this session** |
| 7 | Docker / Nginx / docs (API, DB, security, deploy, testing) | **this session** |
| 8 | Remaining module APIs (catalog, portfolio, blog, support, media) | next |
| 9 | Next.js frontend: design system + public pages + SEO | next |
| 10 | Admin dashboard UI (Next.js) + CRM/page-builder UI | next |
| 11 | Hardening: 2FA, rate-limit tuning, backups, CI, perf | next |

A single fully-working vertical slice (CRM + Quotations: model → secured API → PDF) is the
**spine** that every later module clones.
