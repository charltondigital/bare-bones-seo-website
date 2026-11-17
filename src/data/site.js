// Shared site identity and links for the two Bare Bones SEO offerings.
export const site = {
  name: 'Bare Bones SEO',
  tagline: 'SEO settings for WordPress and AI-built static sites.',
  description:
    'Essential SEO settings for WordPress and AI-generated static websites. A free WordPress plugin and open-source standards for consistent, visible SEO controls.',
  github: 'https://github.com/charltondigital/bare-bones-seo',
  staticGithub: 'https://github.com/charltondigital/bare-bones-seo-static-sites',
  wporg: 'https://wordpress.org/plugins/bare-bones-seo/',
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
