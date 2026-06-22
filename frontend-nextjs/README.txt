===============================================================================
 PRIME TECH - NEXT.JS FRONTEND  |  SETUP & RUN GUIDE
===============================================================================

A modern, production-ready marketing website for Prime Tech (CCTV, Networking,
Fiber Optic, Access Control, Biometrics, IT & Security Solutions).

Stack: Next.js 15 (App Router) - TypeScript - Tailwind CSS - Framer Motion -
       TanStack Query - Axios. It talks to the existing Django + DRF backend.

This file is a plain-text quickstart. For more detail see README.md in this
folder, and IMPLEMENTATION_REPORT.md / FRONTEND_AUDIT_AND_ROADMAP.md in the
repository root.


-------------------------------------------------------------------------------
 1. PREREQUISITES
-------------------------------------------------------------------------------

  - Node.js 18.18+ (recommended: Node 20 or 22) and npm 10+
        node --version
        npm --version

  - Docker (only used here to run PostgreSQL for the backend)
        docker --version

  - The Django backend must be running and seeded BEFORE the frontend can show
    real content. The frontend reads everything from the backend API at:
        http://127.0.0.1:8000/api/v1/


-------------------------------------------------------------------------------
 2. START THE BACKEND (do this first)
-------------------------------------------------------------------------------

  Open a terminal at the REPOSITORY ROOT (the folder that contains both
  "backend/" and "frontend-nextjs/").

  2.1  Start PostgreSQL (matches backend/.env which uses port 5544):

        docker run -d --name primetech-db -p 5544:5432 \
          -e POSTGRES_USER=primetech \
          -e POSTGRES_PASSWORD=primetech \
          -e POSTGRES_DB=primetech \
          postgres:16-alpine

       (If the container already exists, just start it:  docker start primetech-db)

  2.2  Run migrations, seed demo content, and start Django:

        cd backend
        export $(grep -v '^#' .env | xargs)         # loads dev settings + DB URL
        ../backend_venv/bin/python manage.py migrate
        ../backend_venv/bin/python manage.py seed     # idempotent: safe to re-run
        ../backend_venv/bin/python manage.py runserver 127.0.0.1:8000

       The seed prints the admin password ONCE on first run. Admin login:
         email:    admin@primetech.pk
         password: (shown in the seed output)

  2.3  Confirm the API is up (in another terminal):

        curl http://127.0.0.1:8000/api/health/      ->  {"status":"ok",...}

       API docs:  http://127.0.0.1:8000/api/docs/   (Swagger)
       Admin:     http://127.0.0.1:8000/admin/


-------------------------------------------------------------------------------
 3. SET UP THE FRONTEND
-------------------------------------------------------------------------------

  Open a NEW terminal in the "frontend-nextjs/" folder.

  3.1  Install dependencies:

        cd frontend-nextjs
        npm install

  3.2  Create your local environment file from the example:

        cp .env.example .env.local

       Then open .env.local and confirm/adjust these values:

         API_BASE_URL=http://127.0.0.1:8000/api/v1
             (server-side API base used by React Server Components)

         NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
             (client-side API base used by the browser, e.g. the contact form)

         NEXT_PUBLIC_SITE_URL=http://localhost:3000
             (your site's public origin - used for sitemap, canonical, OG tags;
              set to https://primetech.pk in production)

         NEXT_PUBLIC_BACKEND_HOST=127.0.0.1
             (host allowed for next/image remote images)

       NOTE: .env.local is git-ignored on purpose (it is per-machine config).


-------------------------------------------------------------------------------
 4. RUN IN DEVELOPMENT
-------------------------------------------------------------------------------

        npm run dev

   Open http://localhost:3000

   Hot-reload is enabled. With the backend running you will see real seeded
   content (services, products, projects, blog posts, testimonials, etc.).


-------------------------------------------------------------------------------
 5. BUILD & RUN FOR PRODUCTION
-------------------------------------------------------------------------------

        npm run build      # compiles + prerenders pages (backend must be up)
        npm run start      # serves the production build on http://localhost:3000

   To run on a different port:

        PORT=3002 npm run start


-------------------------------------------------------------------------------
 6. USEFUL SCRIPTS
-------------------------------------------------------------------------------

        npm run dev         Start the dev server (hot reload)
        npm run build       Production build (static + server)
        npm run start       Serve the production build
        npm run lint        ESLint check
        npm run typecheck   TypeScript check (tsc --noEmit)


-------------------------------------------------------------------------------
 7. PROJECT STRUCTURE (high level)
-------------------------------------------------------------------------------

  frontend-nextjs/
    src/
      app/            Routes (App Router). One folder per page; [slug] = dynamic.
                      Also: sitemap.ts, robots.ts, opengraph-image.tsx, manifest.ts
      components/     Reusable UI (Navbar, Footer, cards, Gallery, Explorer,
                      ContactForm, BeforeAfter, Hero, etc.)
      lib/            api.ts/data.ts (server data fetch), http.ts (client/axios),
                      types.ts, seo.ts, schema.ts (JSON-LD), site.ts, utils.ts
    next.config.mjs   Image domains, security headers
    tailwind.config.ts  Brand design tokens (colors, motion)
    .env.example      Copy to .env.local


-------------------------------------------------------------------------------
 8. TROUBLESHOOTING
-------------------------------------------------------------------------------

  * Pages are blank / empty lists / "being updated" messages
      -> The backend is not running or not seeded. Do Section 2 again and
         confirm  curl http://127.0.0.1:8000/api/health/  returns ok.

  * Content changed in the admin but the site still shows the old data
      -> Next caches API responses during build. Clear the cache and rebuild:
             rm -rf .next/cache
             npm run build
         (In dev mode it refreshes automatically within a few minutes.)

  * Images do not load after you upload real photos in the admin
      -> The image host must be allowed in next.config.mjs (images.remotePatterns).
         Local backend media (127.0.0.1:8000) and https hosts are already allowed.
         For a production CDN/host, add its hostname there and rebuild.

  * "Port 3000 is already in use"
      -> Stop the other process, or run on another port:  PORT=3001 npm run dev

  * CORS errors in the browser console
      -> In development the backend allows all origins. In production set
         CORS_ALLOWED_ORIGINS in the backend .env to your frontend domain.


-------------------------------------------------------------------------------
 9. DEPLOYMENT (summary)
-------------------------------------------------------------------------------

  - Set the production environment variables (Section 3.2), especially
    NEXT_PUBLIC_SITE_URL = https://primetech.pk and the API base URLs.
  - Run:  npm ci  &&  npm run build  &&  npm run start
  - Host on Vercel, a Node server, or Docker. Put Nginx in front to serve the
    Next.js app and proxy /api/ to Django.

===============================================================================
