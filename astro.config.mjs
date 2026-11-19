import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import { CATEGORIES, TOOLS } from './src/site.config.ts';

// Cambia esto por tu dominio real antes de publicar
const SITE_URL = 'https://getsitesums.com';

// Categorías sin calculadoras listas salen con noindex: no van al sitemap.
const emptyCategories = CATEGORIES
  .filter((c) => !TOOLS.some((t) => t.category === c.slug && t.ready))
  .map((c) => `${SITE_URL}/${c.slug}/`);

// Fecha de última actualización de cada calculadora (prop `updated`), para <lastmod> del sitemap.
const lastmod = {};
for (const f of readdirSync('./src/pages')) {
  const m = f.endsWith('.astro') && readFileSync(`./src/pages/${f}`, 'utf8').match(/updated="(\d{4}-\d{2}-\d{2})"/);
  if (m) lastmod[`${SITE_URL}/${f.replace('.astro', '')}/`] = m[1];
}

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !emptyCategories.includes(page),
      serialize: (item) => (lastmod[item.url] ? { ...item, lastmod: lastmod[item.url] } : item),
    }),
  ],
});
