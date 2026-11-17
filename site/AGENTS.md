# AGENTS.md

## Stack

- Vanilla HTML/JS/CSS landing page — intentionally no framework
- `build.mjs` orchestrates the whole site build: runs `npm run build` in each
  impl, stages `dist/<name>/`, merges alpine's and vanilla's `dist/shared/`, computes stats
  (bundle bytes+gzip via zlib, LOC, dep counts, build time) into
  `dist/stats.json`
- `server.mjs` — dependency-free static server for `dist/` on :5180
- Firebase deploy target: project ID `weathernow-fab1e` (display name
  `weathernow`) — `.firebaserc` must use the ID, not the display name
  (`firebase.json` → `public: dist`, SPA rewrite `**` → `/index.html`)

## Commands

- `npm run build` - full build: impl builds + staging + stats
- `npm run stage` - staging + stats only (`--skip-builds`); requires impl dist/
  output to already exist
- `npm run preview` - serve `dist/` on :5180
- `firebase deploy` - deploy `dist/` to Firebase Hosting

## Conventions

- Impls must build with relative asset URLs to work at `/<name>/` subpaths:
  `base: './'` in vite.config (lit uses `vite build --base=./`), `baseHref` in
  angular.json; alpine's and vanilla's `<base href="/<name>/">` already align
- stats.json is generated data — the landing page fetches it at runtime
- `buildMs` is `null` when staged via `--skip-builds`; the table renders `—`
