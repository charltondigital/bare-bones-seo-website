// Single source for copy that appears in more than one place.
export const site = {
  name: 'Bare Bones SEO',
  tagline: 'SEO settings. Nothing else.',
  description:
    'A minimal WordPress SEO plugin for developers and agencies: indexing, sitemaps, titles, descriptions, schema, and redirects, without the overhead.',
  github: 'https://github.com/charltondigital/bare-bones-seo',
  wporg: null, // Set to the WordPress.org URL once approved.
  maker: { name: 'Charlton Digital', url: 'https://charltondigital.com' },
};

export const features = [
  {
    name: 'Indexation controls',
    detail: 'Set indexing and sitemap behavior for every post type from one screen.',
  },
  {
    name: 'Page-level overrides',
    detail:
      'Title, description, JSON-LD schema, and indexing on every post. A page can be stricter than the site setting, never looser.',
  },
  {
    name: 'Bulk meta editor',
    detail: 'Audit and edit titles, descriptions, and indexing across the whole site without opening each editor.',
  },
  {
    name: '301 redirects',
    detail: 'Handle moved pages and external redirects. Runs only on 404s, so normal page loads pay nothing.',
  },
  {
    name: '404 monitor',
    detail: 'A read-only log of broken paths, so you can see what visitors are hitting.',
  },
  {
    name: 'Health notices',
    detail: 'Flags common misconfigurations, like a site set to discourage search engines, with a one-click fix.',
  },
];

export const left_out = [
  'Content analysis and readability scores',
  'Keyword tracking and rank monitoring',
  'Traffic-light grades',
  'Dashboard widgets',
  'Upsells and nag notices',
  'Telemetry',
  'Tracking script injection',
];
