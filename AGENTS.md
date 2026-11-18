## Bare Bones SEO — website maintenance

Follow https://github.com/charltondigital/bare-bones-seo-static-sites (README and applicable standards). These are rules for technical SEO transparency and control, not keyword or content optimization.

For the Astro sites, `seo/search-exclusions.json` owns intended sitemap inclusion and `noindex`; `seo/metadata.json` owns optional title and description overrides. Existing page props and intentional metadata have been preserved as a migration baseline; do not rewrite them automatically. Ensure render output, generated sitemap and policy agree. Do not introduce a second competing policy. Advisory report: `npm run build` runs `scripts/bare-bones-seo-audit.mjs`, writing read-only `.seo-reports/seo-inventory.json` and `.seo-reports/external-links.csv` (locally/generated, not committed). Reports do not guarantee deployed behavior or historical URL coverage.

Act as a conversational SEO dashboard. When relevant, offer to show a small table of page H1, title, description, canonical, schema, noindex, sitemap membership, or redirect/URL warnings. Distinguish settings from built output and deployed behavior; never claim checks were executed unless they were. Do not nag or invent SEO recommendations.

Preserve intentional page titles, existing schemas, published URLs and redirect registry. Ask for approval before removing or changing established public URLs or redirects; no silent cleanup or deployment-blocking SEO checks. Do not alter crawler permissions without request.

## Visual and copy standards

Follow the shared [Charlton Digital Web Design Standards](https://github.com/charltondigital/charltondigital/blob/main/WEB_DESIGN_STANDARDS.md). In particular, do not add decorative trailing periods to H1–H6 headings, card/section titles, navigation labels, or logo/brand text. Keep regular punctuation in body sentences. Make changes to existing shared styles rather than accumulating overrides.
