# CLAUDE.md — ConstructionTools (BuildCalc AU, provisional name)

Read this before doing any work in this repo. It holds the project goals and the
decisions already made. The owner (Oswaldo) speaks Spanish: talk to him in Spanish,
but everything published on the site is written in Australian English.

Also read:
- `docs/ROADMAP.md` — the phased plan. Work on the current phase unless told otherwise,
  and tick items off as they are done.
- `docs/keyword-research.md` — keyword data and page priorities.

## What this project is

A content site of free calculators and cost guides for building, renovation and
plumbing in **Australia**, monetised with ads, affiliates and, later, trade leads.
It is a personal project, not client work.

Why this niche: Oswaldo has hands-on residential hydraulic/sanitary design experience
(Revit) and works with Australian trade businesses, which gives the site genuine
expertise. Interactive calculators also hold up better against Google's AI answers
than plain informational articles, and Australian traffic pays well.

## Audience

Australian homeowners, DIYers and small tradies. Metric units only (m, mm, m², m³, L,
kPa). Prices in AUD. Reference Australian standards where relevant (for example
AS 2870 for slabs and footings, AS/NZS 3500 for plumbing), without claiming
compliance on the user's behalf.

## Monetisation plan (in order)

1. Affiliate links (Amazon AU and similar) — not set up yet.
2. Google AdSense once there are ~20–30 solid pages. Ads are wired but disabled:
   set `adsenseClient` in `src/site.config.ts` and update `public/ads.txt`.
3. Journey by Mediavine at ~1,000 sessions/month.
4. Raptive at ~25,000 pageviews/month (needs at least half of traffic from
   tier-one countries; Australia counts).
5. Lead generation: cost pages end with a "get quotes from a local tradie" `.cta`
   block that can later be sold to trade businesses. Do not build a lead form until
   Oswaldo asks.

Ezoic is ruled out (minimum raised to 250k monthly users in Feb 2026).

## Tech stack and why

- **Astro 5, fully static output.** Every page must ship complete HTML so Google and
  the AdSense reviewer see the content without running JavaScript. Do not switch to
  client-side rendering, a SPA, or Lovable.
- Calculator logic is plain TypeScript in a `<script>` tag on the page, using the
  helpers in `src/lib/calc.ts`. Only add a framework island (React) if a calculator
  truly needs it.
- Hosting: Cloudflare Pages (build `npm run build`, output `dist`). `public/_headers`
  sets security and cache headers.
- `@astrojs/sitemap` generates the sitemap. `trailingSlash: 'always'`.

## Commands

- `npm run dev` — local server at http://localhost:4321
- `npm run check` — type check (must report 0 errors before committing)
- `npm run build` — production build into `dist/`

## Repo layout

- `src/site.config.ts` — site name, author, contact, AdSense / GA4 / Cloudflare
  analytics IDs, and the `TOOLS` list (slug, title, category, `ready`, `related`).
  The home page, 404 page and "Related calculators" are all generated from `TOOLS`.
- `src/layouts/Base.astro` — head: title, description, canonical, Open Graph,
  favicon, JSON-LD, ad and analytics scripts; header and footer.
- `src/layouts/CalculatorLayout.astro` — wraps every calculator: breadcrumbs, H1,
  lede, author + "Updated" date, FAQ section, related calculators, disclaimer, and
  the WebApplication + BreadcrumbList + FAQPage schema. Pages only supply the
  calculator and the article content.
- `src/lib/calc.ts` — shared helpers: accessible tabs, reading inputs, syncing the
  state to the URL (shareable results) and the "copy link" button.
- `src/components/AdSlot.astro` — manual ad slot; renders nothing until AdSense is on.
- `src/styles/global.css` — single stylesheet with light/dark tokens.
- `src/pages/concrete-calculator.astro` — **the reference template** for every new
  calculator. Copy its structure.
- `public/` — favicon, `og-default.png` (social share image), robots, ads.txt, _headers.

## How to build a new calculator page

1. Pick the next page from `docs/ROADMAP.md` and its target keyword and variants
   from `docs/keyword-research.md`.
2. **URL slug = the main keyword**, e.g. `/tile-calculator/`. Add the tool to `TOOLS`
   in `site.config.ts` with `ready: true` and fill `related`.
3. Create `src/pages/<slug>.astro` using `CalculatorLayout`, passing:
   - `title`: main keyword first, under ~60 characters.
   - `description`: under ~155 characters, says what it does, free, Australian.
   - `h1`, `lede`, `updated` (today's date, ISO), and `faqs`.
4. **Calculator first**, inside `<section class="card" id="calc">`:
   - Sensible Australian defaults so a result shows on load.
   - Results inside an `aria-live` `.results` block.
   - A `.working` line that shows the formula with the user's numbers.
   - Use `initTabs`, `readInputs`, `syncUrl` and `copyLink` from `src/lib/calc.ts`,
     and read initial values from the URL like the concrete page does.
   - Must work at 390 px wide.
5. `<AdSlot />` straight after the calculator, never inside it.
6. Article content below: how the calculation works (formula), at least one
   practical table, tips, and when to call a professional. Genuinely useful,
   roughly 600–1,200 words, no padding.
7. A `.cta` block. On cost pages it points to getting quotes from a licensed tradie.
8. FAQs: build them from the "Questions" keywords in Semrush. 4–6 is enough.
9. Check: `npm run check`, `npm run build`, then verify the maths by hand with two
   or three inputs and look at the page in the browser on a phone-sized window.
10. Update `docs/keyword-research.md` (status "Built") and tick it in `docs/ROADMAP.md`.

## Content rules

- Australian English spelling (metre, colour, etc.).
- **Never invent statistics, prices or regulatory claims.** For cost figures, use a
  real source (cite it in the page), ask Oswaldo, or let the user enter their own
  price. Every estimate is labelled a guide only. Cost ranges must be reviewed by
  Oswaldo before publishing.
- Do not copy text from competitor pages. Write original explanations.
- Safety-relevant topics (structural, gas, electrical, plumbing, backflow) must tell
  the reader to use a licensed tradesperson or engineer.
- Clean experience: no pop-ups, no ads that push the calculator down.
- When a page's content changes meaningfully, update its `updated` date.

## Working style with Oswaldo

- He is learning this as he goes: explain briefly, in Spanish, what you changed and why.
- Build one page at a time, show it working (`npm run dev`), then commit.
- Commit messages in English, short and descriptive.
