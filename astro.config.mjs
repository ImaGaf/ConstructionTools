import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { CATEGORIES, TOOLS } from './src/site.config.ts';

// Cambia esto por tu dominio real antes de publicar
const SITE_URL = 'https://getsitesums.com';

// Categorías sin calculadoras listas salen con noindex: no van al sitemap.
const emptyCategories = CATEGORIES
  .filter((c) => !TOOLS.some((t) => t.category === c.slug && t.ready))
  .map((c) => `${SITE_URL}/${c.slug}/`);

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !emptyCategories.includes(page) })],
});
