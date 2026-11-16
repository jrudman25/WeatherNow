# AGENTS.md

## Stack

- Svelte 5 (runes syntax) + Vite 8, plain JavaScript (no TypeScript)
- `@sveltejs/vite-plugin-svelte` 7
- No router, no state library. Single-screen app in `src/App.svelte`
- Framework-agnostic app code (OWM fetch, theme map, derived-value helpers,
  full stylesheet, sample payload) lives in `../shared/` — import it via
  `../../shared/` paths rather than duplicating
- Builds to `dist/`; no per-implementation hosting config (the repo plans a
  single aggregate `site/` deploy, not one deploy per framework)

## Commands

- `npm run dev` - Vite dev server (default port 5173)
- `npm run build` - production build to `dist/`
- `npm run preview` - serve the production build locally

## Conventions

- Svelte 5 runes only: `$state`, `$derived`, `bind:`, event attributes like
  `onsubmit` (not the Svelte 4 `on:` syntax)
- Secrets go in `.env` as `VITE_*` vars, read via `import.meta.env`. Never
  commit `.env`; `.env.example` documents required keys
- Weather themes map OpenWeatherMap `weather.main` groups to CSS classes that
  set `--c1`/`--c2` gradient stops on `.scene` (defined in `shared/`)
- npm `min-release-age` is 7 days; pin new deps to versions published at least
  a week ago

## Notes

- Firebase deploy config lives at `../site/` (moved out of this impl when the
  repo became a playground); run `firebase deploy` from `site/`, not here
- 2 low-severity `npm audit` findings via `deepmerge` inside
  `@sveltejs/vite-plugin-svelte` (build-time only, no fix published yet)
