import { defineConfig } from 'astro/config';
import { writeFile } from 'node:fs/promises';
import { sitemapAllows } from './src/lib/bare-bones-seo.js';

const site = 'https://barebonesseo.com';
const sitemap = {
  name: 'bare-bones-seo-sitemap',
  hooks: {
    'astro:build:done': async ({pages,dir}) => {
      const urls = [...new Set(pages.map(p => p.pathname)
        .filter(p => p !== '/404' && p !== '/404/' && !/\.(?:xml|txt|json)$/i.test(p))
        .filter(sitemapAllows).map(p => new URL(p,site).href))].sort();
      const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;');
      const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + urls.map(u => '  <url><loc>'+escape(u)+'</loc></url>').join('\n') + '\n</urlset>\n';
      await writeFile(new URL('sitemap.xml',dir),xml);
    },
  },
};

export default defineConfig({
  site,
  build: { inlineStylesheets: 'always' },
  integrations: [sitemap],
});
