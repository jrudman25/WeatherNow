# AGENTS.md

## Stack

- Next.js 16 + React 19, App Router, plain JavaScript/JSX (no TypeScript)
- `output: 'export'` — fully static; Firebase Hosting can't run a Node
  server, so no server components doing work, no SSR/ISR, no route handlers.
  `app/page.jsx` is a server component that renders the `'use client'`
  `weather-app.jsx`; the shipped experience is a hydrated SPA
- Framework-agnostic app code lives in `../shared/` — imported via
  `../../shared/` paths rather than duplicating. `turbopack.root` in
  `next.config.mjs` is set to the repo root so Turbopack accepts those
  imports (it refuses files outside the project root by default)
- Builds to `out/` (not `dist/`); no per-implementation hosting config
  (`site/` owns the repo's single deploy)

## Commands

- `npm run dev` - `next dev` on :3000 (serves at `/nextjs` due to basePath)
- `npm run build` - static export to `out/`

## Conventions

- `basePath: '/nextjs'` — generated asset URLs become `/nextjs/_next/...`,
  absolute from the domain root, which resolves correctly when staged at
  `site/dist/nextjs/`. Same hardcoded-subpath tradeoff as `astro/`,
  `alpine/`, and `vanilla/` — Next has no relative-base option
- Secrets in `.env` as `NEXT_PUBLIC_*`, read via `process.env` (inlined at
  build); `.env.example` documents required keys
- Global CSS (`shared/app.css`) is imported in `app/layout.jsx` — App Router
  only allows global stylesheets there, not in leaf components
- `_next/**` output is content-hashed and covered by an immutable
  `Cache-Control` rule in `site/firebase.json`; `index.html` is `no-cache`
- `.next/` build cache and `out/` are gitignored and skipped by
  `site/build.mjs` LOC counting
- npm `min-release-age` is 7 days; pin new deps to versions published at
  least a week ago
