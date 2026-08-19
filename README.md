# Rishabh Kaushik — Personal Site

Personal portfolio for **Rishabh Kaushik**, Software Developer (Calgary, AB).
Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4** and **Motion**.

```bash
npm install
cp .env.example .env.local   # optional — the site runs without any keys
npm run dev                  # http://localhost:3000
```

Requires **Node 22.5+** (the view counter uses the built-in `node:sqlite` module).

---

## Content policy

Every claim on this site traces to one of two documents:

- `Rishabh_Kaushik_Resume_Convverge.pdf` — summary, technical skills, professional
  experience, education, professional development
- `portfoliofitcheck.md` — the FitCheck project write-up

Nothing is invented for effect. If a statement is not in one of those two files, it does
not belong on the site. `src/data/site.ts` and `src/data/projects.ts` carry that note at
the top so it survives future edits.

## Pages

| Route | Source |
| --- | --- |
| `/` | Hero, capability bento, technology marquee, glance, both projects, GitHub panel |
| `/about` | Professional summary, technical skills, experience / education / development timeline |
| `/projects` | Both projects with a category filter |
| `/projects/gbtac-platform` | From the resume's Professional Experience section |
| `/projects/fitcheck` | From the FitCheck write-up — overview, decisions, limitations |
| `/uses` | The resume's Technical Skills block, grouped |
| `/links` | Email, GitHub, résumé PDF |
| `/privacy`, `/terms` | Site legal pages |

Résumé is served at `/Rishabh-Kaushik-Resume.pdf` from `public/`. The committed copy is a
web version with the phone number removed — the repo is public, and anything in git history
is permanent. Keep the full version (with phone) outside the repo for job applications.

## What's functional

| Feature | How it works |
| --- | --- |
| **GitHub panel** | `/api/github` hits the GitHub REST API for profile, repos and public events, plus GraphQL for the exact contribution calendar when a token is present. Cached 30 min. |
| **Contribution graph** | Real data. Without a token it is derived from public push events and says so in the UI. |
| **View counters** | `POST /api/views` increments per-path counts on project pages, with IP rate limiting. |
| **Command palette** | `⌘K` / `Ctrl+K` — fuzzy search over pages, projects and actions, full keyboard navigation. |
| **Storage** | Three adapters resolved at runtime: Upstash Redis → SQLite (`node:sqlite`) → in-memory. |

Every integration degrades gracefully. With an empty `.env.local` the site still builds,
renders and navigates — the GitHub panel shows an honest fallback rather than breaking.

## SEO

- **Unique title + meta description on every route**, all trimmed to ≤160 characters on a
  word boundary so nothing is cut mid-word in a search result (`metaDescription()` in
  `src/lib/seo.tsx`).
- **Canonical URL on every page**, driven by `NEXT_PUBLIC_SITE_URL`.
- **Open Graph images**: seven 1200×630 cards in `public/og/`, one per page, rendered from
  the site's own fonts and gradient so a shared link looks like the site.
- **Structured data** as real `<script type="application/ld+json">` markup in the server
  HTML — `Person` and `WebSite` sitewide, plus `SoftwareSourceCode` and `BreadcrumbList` on
  each project page. Not emitted via `next/script`, which would defer it into a client-side
  JS payload that crawlers should not have to execute.
- **`sitemap.xml`** (9 URLs, generated from the project data) and **`robots.txt`** with
  `/api/` disallowed.
- **Favicon set** generated from the RK logo in Instrument Serif italic: a multi-size
  `favicon.ico` (16/32/48 — the 16px entry uses a simplified single-letter mark, because the
  serif hairlines are illegible at that size), `apple-icon.png`, and 192/512/maskable PWA
  icons wired into the web manifest.
- One `<h1>` per page, `alt` text on every image, and `ink-faint` raised from `#6b6b6b` to
  `#7d7d7d` so the small mono labels clear WCAG AA (3.94:1 → 5.1:1).

No `twitter:` tags are emitted — X/Twitter falls back to Open Graph when they are absent,
and there is no account to credit.

To regenerate the OG cards or icons after a copy change, the render scripts are simple
Playwright pages; the images are committed to `public/` so there is no build-time cost.

## Motion inventory

Custom two-part cursor (dot + trailing ring with contextual labels) · Lenis smooth scroll ·
route transitions · one-time intro curtain (session-scoped) · canvas starfield with pointer
and scroll parallax · mask-clipped text reveals (word and character) · scroll-driven CSS-3D
Rubik's cube · animated SVG node graph with travelling packets · magnetic buttons · 3D tilt
cards with cursor-tracking specular highlights · spotlight groups · seamless marquees ·
`layoutId` pill indicators · staggered scroll reveals with blur · animated counters ·
shimmer skeletons · scroll progress bar · spring-animated toasts · animated timeline rail.
All of it respects `prefers-reduced-motion`.

The site is dark-only by design. A light theme would need real design work rather than
token flipping — the starfield, gradients and glass surfaces all assume a dark base.

## Structure

```
src/
├── app/                     routes, API handlers, sitemap / robots / manifest
├── components/
│   ├── layout/              nav, footer, cursor, smooth scroll, palette, page header
│   ├── ui/                  reveal, text-reveal, magnetic, tilt, marquee, starfield, toast…
│   ├── home/                hero, bento grid, node graph, marquee band, glance, featured work
│   ├── widgets/             github panel, contribution graph, view counter
│   ├── projects/  about/
│   └── three/               CSS-3D Rubik's cube
├── data/                    site config, projects, uses, links
├── hooks/                   media query, pointer, local time, copy, fetch, scroll direction
├── lib/                     github, storage, rate limit, fonts, utils
└── fonts/                   self-hosted woff2
```

## Editing content

- `src/data/site.ts` — name, role, location, email, nav, marquee, capability tabs
- `src/data/projects.ts` — both projects; each gets a detail page automatically
- `src/data/uses.ts`, `src/data/links.ts` — the corresponding pages

Replace `public/images/avatar.svg` with a real photo (any filename — update `site.avatar`).
Replace `public/Rishabh-Kaushik-Resume.pdf` when the résumé changes.

## Fonts

Self-hosted woff2 in `src/fonts`, loaded with `next/font/local` — no network request at
build or runtime, no layout shift.

- **Outfit** — body
- **Space Grotesk** — display headings
- **Instrument Serif** — italic accent lines
- **IBM Plex Mono** — labels and eyebrows

## Deploying

Works on Vercel with zero config. Set `NEXT_PUBLIC_SITE_URL` to the production URL so
metadata, Open Graph and the sitemap resolve correctly. Add `GITHUB_TOKEN` for the exact
contribution calendar, and Upstash credentials if you want view counts to persist.
