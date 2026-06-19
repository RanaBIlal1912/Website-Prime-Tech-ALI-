# Prime Tech Platform

> **Prime Tech — _Your Security, Our Priority_**
> CCTV · Security Systems · IT Services · Networking · Biometrics · Access Control — Bahawalpur, Pakistan.

A production-grade corporate platform: a Django + DRF + PostgreSQL backend powering a
secure multi-role admin panel, a full CRM, quotation generation, support ticketing, a
media library, and a headless content API for the (forthcoming) Next.js public site.

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the design rationale, the full domain model,
and the phased build plan. This README is the operational guide.

---

## Status

| Delivered (this phase) | Planned (next phases) |
|------------------------|-----------------------|
| Django 5 + DRF backend, split settings | Next.js + Tailwind public site (design system ported from `legacy/`) |
| PostgreSQL schema — all 16+ entities, migrated | Admin dashboard UI (React) + live page builder |
| JWT auth (access+refresh, rotation, blacklist) | 2FA enforcement (model + flow are already 2FA-ready) |
| RBAC: 5 seeded roles, runtime-editable permissions | CI pipeline, automated backups, perf/CDN tuning |
| CRM (leads, customers, notes, follow-ups, timeline) | |
| Quotations (auto-number, tax/discount, **PDF export**) | |
| Support tickets, Catalog, Portfolio, Blog, Media — real CRUD APIs | |
| Audit logging, login lockout, throttling | |
| OpenAPI docs, Docker/Nginx, seed from legacy data | |
| Automated test suite (13 tests, passing) | |

The legacy static site is preserved under [`legacy/`](./legacy) as design + content reference.

---

## Quickstart (local, no Docker)

```bash
# 1. Postgres (Docker is easiest):
docker run -d --name primetech-pg -p 5544:5432 \
  -e POSTGRES_USER=primetech -e POSTGRES_PASSWORD=primetech -e POSTGRES_DB=primetech \
  postgres:16-alpine

# 2. Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # DATABASE_URL points at 127.0.0.1:5544 by default

python manage.py migrate
SEED_ADMIN_EMAIL=admin@primetech.pk SEED_ADMIN_PASSWORD='ChangeMe@2026' python manage.py seed
python manage.py runserver 127.0.0.1:8009
```

- API root: `http://127.0.0.1:8009/api/v1/`
- Interactive docs (Swagger): `http://127.0.0.1:8009/api/docs/`
- ReDoc: `http://127.0.0.1:8009/api/redoc/`
- Django admin: `http://127.0.0.1:8009/admin/`

## Quickstart (Docker, production-style)

```bash
cp .env.example .env          # fill SECRET_KEY, JWT_SIGNING_KEY, passwords, hosts
RUN_SEED=true docker compose up --build   # first run seeds; set RUN_SEED=false after
```
Nginx serves on `:80` (uncomment the `:443` block in `nginx/conf.d/primetech.conf`
after placing certs in `nginx/certs/` — e.g. from Let's Encrypt/Certbot).

---

## API reference (v1)

All endpoints are under `/api/v1/`. Authenticated requests send `Authorization: Bearer <access>`.

### Auth (`/auth`)
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/auth/login/` | email+password → `{access, refresh, user}` (throttled 5/min, lockout after 5 fails) |
| POST | `/auth/refresh/` | refresh → new access (rotating; old refresh blacklisted) |
| POST | `/auth/logout/` | blacklist a refresh token |
| GET  | `/auth/me/` | current user + resolved permissions |
| POST | `/auth/me/change-password/` | change own password |
| CRUD | `/auth/users/` | user management (`users` module) |
| CRUD | `/auth/roles/` | role + permission editing (`roles` module) |
| GET  | `/auth/permissions/` | full permission catalogue (Super Admin) |

### CRM (`/crm`)
| Method | Path | Notes |
|--------|------|-------|
| CRUD | `/crm/leads/` | list is light; detail embeds timeline, notes, follow-ups |
| GET/POST | `/crm/leads/{id}/notes/` | add/list notes |
| GET/POST | `/crm/leads/{id}/followups/` | schedule/list follow-ups |
| GET | `/crm/leads/{id}/timeline/` | activity timeline |
| CRUD | `/crm/customers/` | customer management |
| POST | `/crm/public/leads/` | **public**, unauthenticated website intake (throttled) |

### Quotations (`/quotations`)
| Method | Path | Notes |
|--------|------|-------|
| CRUD | `/quotations/` | nested line items; totals/tax/discount computed server-side; auto `QT-#####` |
| GET | `/quotations/{id}/pdf/` | branded PDF download (also the print source) |

### Other modules
`/catalog/{categories,services,products,testimonials}` · `/portfolio/projects/` ·
`/blog/{categories,tags,posts}` · `/support/tickets/` (+ `/support/public/tickets/`) ·
`/media-library/{folders,files}` (+ `files/bulk-upload/`) · `/audit/logs/` (read-only) ·
`/cms/{settings,seo,backgrounds,home-sections}`.

Public read access (no auth) is enabled for website-facing content: services, products,
portfolio, published blog posts, testimonials, and CMS settings/backgrounds.

---

## Database schema

16+ entities; every business model uses a UUID PK, `created_at/updated_at`, and soft-delete.
Full ERD and field list: [`ARCHITECTURE.md` §4](./ARCHITECTURE.md). Summary:

- **accounts**: `User` (email login) → `Role` → `Permission` (`module.action` codenames)
- **crm**: `Customer` → `Lead` → {`LeadNote`, `FollowUp`, `Activity`}
- **catalog**: `Category` → {`Service`, `Product`}, `Testimonial`
- **portfolio**: `Project`
- **blog**: `Category`, `Tag`, `Post` (draft/publish + SEO)
- **support**: `Ticket` (auto `TKT-#####`) → `TicketReply`
- **quotations**: `Quotation` (auto `QT-#####`) → `QuotationItem`
- **mediahub**: `MediaFolder` → `MediaFile` (storage-agnostic)
- **core**: `SiteSetting` (singleton), `SeoSetting`, `PageBackground`, `HomeSection`
- **audit**: `AuditLog` (append-only)

Inspect/recreate locally with `python manage.py migrate` and `python manage.py dbshell`.

---

## Security

Implemented (see also `config/settings/base.py` and `prod.py`):

- **Auth**: JWT access (30 min) + rotating refresh (7 d) with blacklist-after-rotation.
- **Passwords**: Argon2 hashing; min length 10 + similarity/common/numeric validators.
- **RBAC**: every admin endpoint gated by `HasModulePermission`; permissions are data,
  editable per-role at runtime; Super Admin bypass.
- **Brute force**: login throttled (5/min) **and** account lockout (5 fails → 15 min lock).
- **Throttling**: anon 60/min, user 1000/h, public forms 20/h.
- **Transport (prod)**: SSL redirect, HSTS (preload), secure+HttpOnly+SameSite cookies.
- **Headers**: `X-Frame-Options: DENY`, `nosniff`, referrer policy, CORS allow-list.
- **CSRF**: Django CSRF middleware; trusted origins allow-listed.
- **SQL injection**: ORM-parameterised queries throughout (no raw SQL on user input).
- **File uploads**: extension allow-list (img/video/doc) + 50 MB cap + image introspection.
- **Audit**: actor, action, target, IP, and user-agent recorded for sensitive operations.
- **2FA-ready**: `User.is_two_factor_enabled` / `two_factor_secret` fields in place.
- **Secrets**: 12-factor; nothing hard-coded — admin seed reads env or generates+prints once.

> Production checklist: set a real 50+ char `SECRET_KEY` and ≥32-byte `JWT_SIGNING_KEY`,
> `DEBUG=False`, explicit `ALLOWED_HOSTS`, HTTPS certs, and rotate the seeded admin password.

---

## Deployment

1. Provision a host with Docker + Docker Compose; point DNS at it.
2. `cp .env.example .env`; fill secrets, hosts, and DB credentials.
3. Obtain TLS certs (Certbot) → place `fullchain.pem`/`privkey.pem` in `nginx/certs/`;
   uncomment the `:443` server block.
4. `RUN_SEED=true docker compose up --build -d` (first boot only), then set `RUN_SEED=false`.
5. The `backend` entrypoint waits for the DB, runs migrations, and collects static files.

### Backups
```bash
# Database (run on a schedule, e.g. cron / systemd timer):
docker compose exec -T db pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > backup-$(date +%F).sql.gz
# Restore:
gunzip -c backup-YYYY-MM-DD.sql.gz | docker compose exec -T db psql -U "$POSTGRES_USER" "$POSTGRES_DB"
# Media: snapshot the `media` volume, or use an S3/R2 backend (versioned bucket).
```

### Logging
Structured logs to stdout (captured by Docker / your log driver). Set `LOG_LEVEL` via env.

---

## Testing report

Run:
```bash
cd backend && python manage.py test
```

Current suite — **13 tests, all passing** (run against PostgreSQL):

| Area | Coverage |
|------|----------|
| `accounts.AuthTests` | token issuance, wrong-password rejection, **account lockout**, **login throttling (429)**, `/me` requires auth |
| `accounts.RBACTests` | role can read permitted module; denied (403) on others; technician blocked from quotations |
| `quotations.QuotationModelTests` | auto-number increment, **tax+discount math** (59 000 → 65 578.50), PDF renders (`%PDF`) |
| `crm.PublicLeadIntakeTests` | unauthenticated intake creates lead + activity; public cannot list leads (401) |

Manually verified end-to-end against a live server: health, login (84 perms for Super Admin),
public lead capture, public catalogue read, quotation create + PDF (HTTP 200, valid PDF),
RBAC denials, and audit-log capture.
