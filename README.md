# Site Sums (getsitesums.com)

Sitio de calculadoras para construcción y renovación en Australia. Astro, HTML estático, Cloudflare Pages.

- **Contexto para Claude Code:** `CLAUDE.md`
- **Plan por fases:** `docs/ROADMAP.md`
- **Palabras clave:** `docs/keyword-research.md`

## Comandos
    npm install
    npm run dev        # http://localhost:4321
    npm run check      # revisión de tipos
    npm run build      # genera dist/

## Publicar en Cloudflare Pages
Workers & Pages → Create → Pages → conectar este repo.
Preset: Astro · Build: `npm run build` · Output: `dist`.
