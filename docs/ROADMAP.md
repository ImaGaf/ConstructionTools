# Roadmap — Site Sums

Plan por fases. Cada fase tiene una meta, una lista de tareas y prompts listos para
pegar en Claude Code. Marca con `[x]` lo que vayas terminando.

Regla general: no pases a la siguiente fase sin cumplir la meta de la actual.
Publicar de forma constante pesa más que publicar mucho de golpe.

---

## Fase 0 — Base técnica ✅ (hecha)

- [x] Astro estático + sitemap + robots.txt
- [x] Plantilla `CalculatorLayout` (migas de pan, autor, fecha, FAQ, relacionadas, schema)
- [x] Calculadora de concreto (12.100 búsquedas/mes, KD 17)
- [x] Páginas Privacy Policy, Terms, 404, About y Contact (repuestas el 19 nov con oswaldoj.tipan@gmail.com)
- [x] Favicon, imagen para redes (OG), cabeceras de Cloudflare
- [x] AdSense, GA4 y Cloudflare Analytics preparados (apagados)
- [x] Resultados compartibles por enlace
- [x] Diseño "Site plan" aplicado (portada, calculadora, móvil, categorías)
- [x] Páginas de categoría con noindex automático si están vacías
- [x] Fuentes servidas desde el propio sitio
- [x] Rediseño "Obra" (19 nov): oscuro + naranja, fotos reales con parallax, esquinas rectas
- [x] Exportar cualquier cálculo a PDF (con el diagrama) y Excel

---

## Fase 1 — Lanzamiento (esta semana)

**Meta:** sitio publicado en tu dominio y conectado a Google.

Lo haces tú (no Claude Code):
- [x] Elegir nombre: **Site Sums** (19 nov)
- [x] Dominio `getsitesums.com` comprado en Cloudflare (sitesums.com estaba tomado)
- [x] Publicado en Cloudflare Workers (static assets) con el dominio y redirección www → raíz (19 nov)
- [x] Google Search Console: dominio verificado (vía Cloudflare) y `sitemap-index.xml` enviado (19 nov)
- [x] Cloudflare Web Analytics activo con inyección automática de Cloudflare (sin token en el código)
- [x] Email real para la Privacy Policy y Contact (oswaldoj.tipan@gmail.com)

Prompt para Claude Code:
> Lee CLAUDE.md. El sitio se va a llamar [NOMBRE] y el dominio es [DOMINIO].
> Actualiza astro.config.mjs, robots.txt, site.config.ts (nombre, email [EMAIL],
> ga4Id [ID]), el logo del header y la imagen og-default.png. Luego build y commit.

---

## Fase 2 — Las 5 páginas núcleo (semanas 1–4)

**Meta:** 5 calculadoras con las palabras clave ya medidas.

- [x] Concrete calculator
- [x] Bathroom renovation cost calculator (2.400/mes, CPC $2,37; variantes con KD 5–15)
- [x] Kitchen renovation cost calculator (1.900/mes, KD 19, SERP débil)
- [x] Tile calculator (1.300/mes + "tile estimator calculator" 1.000/mes)
- [x] Hot water system replacement cost (720/mes, CPC $4,12: la mejor para leads)
- [x] Concrete steps calculator (1.000 + 480/mes, KD 5–21; solo matemática)
- [x] Concrete price per m³ / cost (~5.000/mes sumando variantes, KD 8–20)
- [x] Concrete driveway cost + exposed aggregate (1.600 + 2.400/mes, CPC $5–6)

Antes de las páginas de costos: consigue fuentes reales de precios en Australia
(guías de Canstar, hipages, ServiceSeeking, cotizaciones que conozcas por tu trabajo).
Las páginas de costos **no pueden inventar rangos**.

Prompt para Claude Code (uno por página):
> Lee CLAUDE.md, docs/ROADMAP.md y docs/keyword-research.md. Construye la página
> [NOMBRE] siguiendo la receta de CLAUDE.md, con concrete-calculator.astro como
> plantilla. Para los rangos de precio usa estas fuentes: [PEGA FUENTES O RANGOS].
> Muéstrame la página con npm run dev antes de hacer commit.

---

## Fase 3 — Investigación y expansión (meses 1–3)

**Meta:** 20–30 páginas útiles y solicitar AdSense.

Investigación (Semrush gratis, 10 búsquedas al día):
- [ ] Medir la lista "Still to check" de `docs/keyword-research.md`
- [ ] Revisar las "Questions" de cada palabra clave: cada una es una FAQ o una guía

Páginas candidatas (decidir con los datos):
- [ ] Retaining wall cost / calculator
- [ ] Decking calculator
- [ ] Gravel, soil, sand y mulch calculator (puede ser una sola herramienta con pestañas)
- [ ] Fence calculator
- [ ] Plasterboard calculator
- [ ] Paver / brick calculator
- [ ] Plumber call-out fee (guía de costos)
- [ ] Blocked drain cost
- [ ] Heat pump hot water rebates by state (contenido que se actualiza: alto valor)
- [x] Pipe fall / gradient calculator (construida 19 nov; falta medir volumen en Semrush y que Oswaldo confirme las pendientes mínimas)
- [ ] Hot water system size calculator

Mejoras del sitio en esta fase:
- [x] Páginas de categoría (Materials, Renovation costs, Plumbing) con texto introductorio
- [ ] Enlaces internos entre calculadoras relacionadas dentro del texto
- [ ] Revisar Search Console cada semana: qué páginas reciben impresiones

Al llegar a ~20–30 páginas:
- [ ] Solicitar AdSense
- [ ] Al aprobar: pegar `ca-pub-...` en `site.config.ts`, actualizar `ads.txt`,
      activar anuncios automáticos y revisar que no tapen las calculadoras

Prompt para Claude Code (investigación):
> Actualiza docs/keyword-research.md con estos datos de Semrush (te pego las capturas).
> Luego reordena el "Build order" por oportunidad: volumen alto, KD bajo y CPC alto.

Prompt para Claude Code (página de categoría):
> Crea páginas de categoría para cada `category` de TOOLS, con 150–300 palabras
> originales de introducción, la lista de herramientas y schema CollectionPage.
> Enlázalas desde las migas de pan de CalculatorLayout.

---

## Fase 4 — Autoridad y tráfico (meses 3–6)

**Meta:** 1.000 sesiones al mes y entrar a Journey by Mediavine.

- [ ] Páginas por ciudad cuando el dato lo justifique
      (ej. "kitchen renovation cost sydney" 480/mes, KD 13). Solo con datos locales reales
- [ ] Guías de apoyo que enlacen a las calculadoras
      (ej. "How thick should a driveway be in Australia")
- [ ] Backlinks: responder en r/AusRenovation, foros de DIY y grupos de Facebook
      cuando la calculadora resuelva la pregunta (sin spam)
- [ ] Ofrecer las calculadoras como widget embebible para blogs de constructoras
      (cada embed = un enlace)
- [ ] Afiliados: Amazon AU (herramientas, mezcladoras, niveles) dentro de las guías
- [ ] Solicitar Journey by Mediavine al pasar 1.000 sesiones al mes

---

## Fase 5 — Monetización fuerte (6+ meses)

**Meta:** ingresos estables por varias fuentes.

- [ ] Leads: formulario "Get 3 quotes" en páginas de costo, vendido a negocios de
      oficios o a una plataforma de leads. **Hablar antes con Liberty Digital**,
      porque se cruza con sus clientes
- [ ] Raptive al pasar 25.000 páginas vistas al mes (50%+ tráfico de Australia/US/UK)
- [ ] Revisar y actualizar precios de las páginas de costos cada 6 meses
- [ ] Evaluar versión para Nueva Zelanda si el tráfico de NZ crece

---

## Rutina semanal sugerida

1. Lunes: 10 búsquedas en Semrush y actualizar `docs/keyword-research.md`
2. Martes a jueves: 2–3 páginas nuevas con Claude Code
3. Viernes: Search Console (impresiones, clics, errores) y ajustar títulos de las
   páginas con impresiones pero pocos clics
