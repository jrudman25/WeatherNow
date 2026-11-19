# AGENTS.md

## Stack

- Vanilla HTML/JS/CSS landing page — intentionally no framework
- `build.mjs` orchestrates the whole site build: runs `npm run build` in each
  impl, stages `dist/<name>/`, merges alpine's and vanilla's `dist/shared/`, computes stats
  (bundle bytes+gzip via zlib, LOC, dep counts, build time) into
  `dist/stats.json`
- `server.mjs` — dependency-free static server for `dist/` on :5180;
  redirects `/<name>` to `/<name>/` like Firebase Hosting
- LOC counting: `SOURCE_EXT` must include each impl's component extension
  (`.svelte`, `.vue`, `.gjs`, `.astro`, ...) and `SKIP_DIRS` must cover
  generated/cache dirs (`tmp` for ember, `.astro`, `.next`, `out`), or the
  LOC column silently under- or over-counts
- Firebase deploy target: project ID `weathernow-fab1e` (display name
  `weathernow`) — `.firebaserc` must use the ID, not the display name
  (`firebase.json` → `public: dist`; no rewrites, so missing files 404)

## Commands

- `npm run build` - full build: impl builds + staging + stats
- `npm run stage` - staging + stats only (`--skip-builds`); requires impl dist/
  output to already exist
- `npm run preview` - serve `dist/` on :5180
- `firebase deploy` - deploy `dist/` to Firebase Hosting

## Conventions

- Impls must build with relative asset URLs to work at `/<name>/` subpaths:
  `base: './'` in vite.config (lit uses `vite build --base=./`), `baseHref` in
  angular.json; alpine's and vanilla's `<base href="/<name>/">` and astro's
  `base: '/astro'` (Astro has no relative-base option), and nextjs's
  `basePath: '/nextjs'` (static export to `out/`) already align
- Caching: `firebase.json` `headers` set `Cache-Control` per path. Without a
  matching rule, Firebase serves `max-age=3600`, so stale files linger for up to
  an hour after a deploy
  - Content-hashed files (Vite's `assets/`): `public, max-age=31536000, immutable`
  - Everything with a stable filename: `no-cache` (browser revalidates via ETag
    and gets a `304` when unchanged) — `**/*.html`, `/`, `/site.css`,
    `/stats.json`, and whole-impl rules for the no-bundler impls (`/alpine/**`,
    `/vanilla/**`, `/shared/**`)
  - Rules are matched against the request path, so `**/*.html` does not cover
    `/` (hence the explicit rule); `/<name>/**` covers `/<name>/`
  - Angular's hashed root files (`main-*.js`, `styles-*.css`) are outside
    `assets/` and get the default; harmless, just not `immutable`
  - Adding an impl: if it emits unhashed JS/CSS (no bundler), add a
    `/<name>/**` `no-cache` rule; if it emits hashed files outside `assets/`,
    optionally add an `immutable` rule for that folder. Don't let rules overlap
    with different values. Check after deploy with
    `curl -I https://weathernow-fab1e.web.app/<name>/<file>`
- Size columns are "all JS/CSS emitted" (files plus inline `<script>`/
  `<style>`), not on-load bytes; impls with a `shared` entry in `IMPLS`
  (alpine, vanilla) also count the `shared/` files they load at runtime.
  Column definitions live in each `<th title>` in `index.html`
- stats.json is generated data — the landing page fetches it at runtime
- `buildMs` is `null` when staged via `--skip-builds`; the table renders `n/a`
