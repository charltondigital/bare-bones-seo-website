# barebonesseo.com

The site for Bare Bones SEO. Built with Astro, hosted free on GitHub Pages.

## Run locally

    npm install
    npm run dev

## Edit

- Copy (features, "left out" list, links): `src/data/site.js`
- Colors, fonts, spacing: the tokens at the top of `src/styles/global.css`
- Page sections: `src/components/`, assembled in `src/pages/index.astro`
- New page: add a file to `src/pages/` that uses the `Base` layout
- When the plugin is approved, set `wporg` in `src/data/site.js` and the hero button and status line switch over.

## Deploy

1. Push this folder to a new GitHub repo (branch `main`).
2. Repo Settings > Pages > Source: **GitHub Actions**. Every push to `main` then builds and deploys.
3. Same page, Custom domain: `barebonesseo.com`.
4. At your registrar, point DNS at GitHub:
   - A records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - CNAME for `www`: `charltondigital.github.io`
5. Once the certificate is issued, tick **Enforce HTTPS**.
