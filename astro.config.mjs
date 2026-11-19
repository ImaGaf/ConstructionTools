import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cambia esto por tu dominio real antes de publicar
export default defineConfig({
  site: 'https://www.example.com.au',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
