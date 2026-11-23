# CLAUDE.md — ConstructionTools (Site Sums, getsitesums.com)

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
- Calculator logic is plain TypeScript in a `<script>` tag on the page, using
  `bindCalculator` from `src/lib/calc.ts`. Only add a framework island (React) if a
  calculator truly needs it.
- Fonts are self-hosted through `@fontsource` (imported in `Base.astro`). Do not add
  Google Fonts `<link>` tags or other external CSS.
- Hosting: Cloudflare Workers with static assets (`wrangler.jsonc`, Worker `getsitesums`;
  build `npm run build`, deploy `npx wrangler deploy`, output `dist`). `public/_headers`
  sets security and cache headers.
- `@astrojs/sitemap` generates the sitemap. `trailingSlash: 'always'`.

## Commands

- `npm run dev` — local server at http://localhost:4321
- `npm run check` — type check (must report 0 errors before committing)
- `npm run build` — production build into `dist/`

## Repo layout

- `src/site.config.ts` — site name, author, contact email (used in the privacy
  policy and contact page), AdSense / GA4 / Cloudflare
  analytics IDs, `CATEGORIES` (slug, name, intro text) and `TOOLS` (slug, title,
  blurb, category, icon, `ready`, `featured`, `related`). The home page, category
  pages, header menu, 404 page and "Related calculators" are all generated from these.
- `src/pages/[category].astro` — one hub page per category, with CollectionPage
  schema. A category with no `ready` tools is `noindex` and left out of the sitemap
  (`astro.config.mjs`) so Google never sees empty pages.
- `src/layouts/Base.astro` — head: title, description, canonical, Open Graph,
  favicon, JSON-LD, ad and analytics scripts; header and footer.
- `src/layouts/CalculatorLayout.astro` — wraps every calculator: breadcrumbs (with
  category), H1, lede, author + date, the two-column calculator (inputs card +
  sticky result panel + CTA), ad slot, table of contents, quick answer, FAQ (as
  `<details>`, always in the HTML), related calculators, disclaimer, the mobile
  result bar (`#mbar-k`, `#mbar-v`) and all schema. Pages fill `slot="inputs"`,
  `slot="result"` and the article sections.
- `src/lib/calc.ts` — `track(name)` sends GA4 events (live since 22 Nov 2026, `ga4Id` G-MXQGSH8YF1;
  never send user inputs). `bindCalculator(root, render)`: every control with
  `data-state` (inputs by `id`, radios by `name`) is read, restored from the URL,
  synced back to the URL (shareable results) and passed to `render`. Also wires
  `#copy-link`, `#copy-status` and `#print`. Helpers: `num`, `fmt`, `setText`.
- `src/components/Icon.astro` — inline stroke icons by name (add new ones there).
- `src/components/DiagramDefs.astro` + `src/lib/diagrams.ts` — the "technical drawing"
  diagram kit: shared hatch patterns (concrete, earth, gravel, grass, timber, wall poché,
  cut tiles) and helpers `canvas`, `el`, `dim` (architect-style dimension lines with
  45° ticks) and `label`. Every calculator diagram is drawn to scale from the user's
  inputs into a `<g id="g-...">` (plans, sections or isometric). Include `<DiagramDefs />`
  once inside `.diagram` and reuse the kit for new calculators.
- `src/components/ToolCard.astro` — the calculator card used on home, categories, 404.
- `src/components/AdSlot.astro` — manual ad slot; renders nothing until AdSense is on.
- `src/styles/global.css` — single stylesheet with the design tokens and components.
- `src/lib/export.ts` — PDF (jsPDF) and Excel (write-excel-file) export, loaded only on click.
- `src/components/Photo.astro` — responsive photo for `.ph` bands and cards.
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
   - Inputs go in `slot="inputs"` as numbered `.step` blocks (`.step-head`).
     Choices are native radios: `.choice-grid` cards for the main option (with a
     small plan-blue SVG), `.seg` segmented controls for small options. Numbers use
     `.field` with the unit inside (`<span class="unit">`). Every control gets
     `data-state`.
   - Results go in `slot="result"`: a `.diagram` that updates with the user's
     numbers where it makes sense, `.big` for the main number, `.stats` tiles,
     `.working` with the formula, and the copy/print buttons. Update `#mbar-k` and
     `#mbar-v` for the mobile bar.
   - Call `bindCalculator(document.getElementById('calc'), render)`.
   - Must work at 390 px wide with no horizontal scroll.
5. `<AdSlot />` straight after the calculator, never inside it.
6. Article content as `<section id="...">` blocks in the default slot, listed in the
   `toc` prop, plus a one-sentence `quickAnswer`. Use the visual blocks:
   `.step-cards` for the formula, `.table-card` tables, `.compare` cards,
   `.checklist`, `.callout`. Genuinely useful, roughly 600–1,200 words, no padding.
   H2s should match the questions people search (check Semrush variants).
7. A `.cta` block. On cost pages it points to getting quotes from a licensed tradie.
8. FAQs: build them from the "Questions" keywords in Semrush. 4–6 is enough.
9. Check: `npm run check`, `npm run build`, then verify the maths by hand with two
   or three inputs and look at the page in the browser on a phone-sized window.
10. Update `docs/keyword-research.md` (status "Built") and tick it in `docs/ROADMAP.md`.

## Design rules ("Obra" style, since 19 Nov 2026)

Approved mockup: the Claude Design canvas "Site Sums — Rediseño". Colours, type and
components are tokens and classes in `src/styles/global.css`; reuse them, never
hard-code new colours.
- Dark carbon zones (`--dark`, `--dark-2`, `--dark-3`) for the header, hero, bands,
  result panel and footer; light "worksheet" zones (`--bg` paper, white cards) for
  calculator inputs and article text, so reading stays easy.
- One accent: safety orange. `--accent` (#f26b1d) for fills with carbon text and for
  orange text on dark; `--accent-ink` (#c2410c) for links/text on light. Plan blue
  `--plan` only inside diagrams.
- Barlow Condensed (800/700, uppercase) for headings and big numbers, Barlow for
  text, JetBrains Mono for the formula line. Highlight one phrase per heading with
  `<em>` (it turns orange).
- Square corners everywhere (`--radius*` = 2px). No gradients, no emoji.
- Real photos (Unsplash License) in `public/images/<key>.webp` + `<key>-sm.webp`,
  registered in `PHOTOS` (site.config.ts) with photographer and alt text, rendered
  with `<Photo name=... />` inside a `.ph` container. Each calculator's title band
  uses the photo named after its slug: add one when you add a calculator (crop
  1600×1000 and 800×533, WebP q≈70, under ~250 KB). Credits are listed on /about/.
- Parallax is CSS-only (`animation-timeline: view()`), off for
  `prefers-reduced-motion`. Never animate the calculator itself.
- Text contrast at least 4.5:1; touch targets at least 44 px.
- Calculator first, result always visible (sticky dark panel on desktop, bottom bar
  on mobile), content below in visual blocks rather than walls of text.
- Every calculator gets PDF and Excel export automatically (`src/lib/export.ts`,
  wired in CalculatorLayout). It reads inputs (`data-state` controls with their
  labels) and results (`.big`, `.stat`, `.checks`, `.breakdown`, `.range-note`,
  `.alert`, `.hint`, `.working`) from the DOM, so new calculators must keep using
  those classes and give every input a `<label for>` or a group label
  (`aria-labelledby`, legend or `.opt-label`).

## About and Contact

`/about/` (who builds the site and how the calculators work) and `/contact/` (email
from `SITE.contactEmail`) are live again since 19 Nov 2026, at Oswaldo's request, and
are linked from the header, footer and the author byline. Keep the About text factual:
only state things Oswaldo has confirmed about himself.

## Cost pages

Cost calculators (see `bathroom-renovation-cost-calculator.astro`) follow extra rules:
- Every price constant lives at the top of the page script with a comment, and the
  page has a "How we estimate" section listing sources, dates and any assumptions.
- Show a total plus the published range for that level, never a single "exact" price.
- Let users replace any line with their own quote (`q-<item>` fields).
- Calibrate the model so typical inputs land inside the published ranges.
- Rebates and regulations change often: verify them on the official government page
  before publishing, record the 'last updated' date in "How we estimate", and
  re-check them every few months (see `hot-water-system-replacement-cost.astro`).

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
