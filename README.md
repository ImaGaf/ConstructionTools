# BuildCalc AU (nombre provisional)

Sitio de calculadoras para construcción y renovación en Australia. Astro, HTML estático.

## Correr en tu PC
    npm install
    npm run dev        # http://localhost:4321

## Publicar en Cloudflare Pages (gratis)
1. Sube esta carpeta a un repo de GitHub.
2. Cloudflare → Workers & Pages → Create → Pages → conecta el repo.
3. Framework preset: Astro. Build command: `npm run build`. Output: `dist`.
4. Conecta tu dominio.

## Antes de publicar
- `astro.config.mjs` y `public/robots.txt`: cambia example.com.au por tu dominio.
- `src/site.config.ts`: nombre del sitio y email.
- `src/pages/about.astro`: escribe quién eres (pesa en la aprobación de AdSense).

## Cuando AdSense te apruebe
- Pon tu `ca-pub-...` en `adsenseClient` de `src/site.config.ts`.
- Reemplaza el contenido de `public/ads.txt` por la línea que te da Google.

## Agregar una calculadora
1. Crea `src/pages/<slug>.astro` copiando `concrete-calculator.astro`.
2. Marca `ready: true` en `TOOLS` dentro de `src/site.config.ts`.
