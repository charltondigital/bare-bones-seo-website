// Bare Bones SEO for Static Sites: centralized intent, implemented with existing Astro tooling.
// https://github.com/charltondigital/bare-bones-seo-static-sites
import exclusions from '../../seo/search-exclusions.json';
import metadata from '../../seo/metadata.json';

export function normalizeSeoPath(value) {
  const pathname = String(value || '/').split(/[?#]/)[0].replace(/\\/g, '/').replace(/\/+/, '/');
  if (pathname === '/' || pathname === '/index.html') return '/';
  const clean = ('/' + pathname.replace(/^\/+/, '')).replace(/\/index\.html$/, '/').replace(/\/+/g, '/');
  return clean.endsWith('/') || /\.[a-z0-9]+$/i.test(clean) ? clean : clean + '/';
}

export function seoPolicy(path) {
  const key = normalizeSeoPath(path);
  const defaults = exclusions.defaults || { index: true, sitemap: true };
  let resolved = { ...defaults };
  const sections = Object.entries(exclusions.sections || {})
    .filter(([pattern]) => pattern.endsWith('/*') && key.startsWith(normalizeSeoPath(pattern.slice(0, -1))))
    .sort((a, b) => a[0].length - b[0].length);
  for (const [, rule] of sections) resolved = { ...resolved, ...rule };
  resolved = { ...resolved, ...(exclusions.pages?.[key] || {}) };
  const override = metadata.pages?.[key] || {};
  return { ...resolved, title: override.title, description: override.description };
}

export function sitemapAllows(path) {
  const policy = seoPolicy(path);
  return policy.sitemap !== false && policy.index !== false;
}
