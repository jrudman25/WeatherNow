# AGENTS.md

## Stack

- Svelte 5 (runes syntax) + Vite 8, plain JavaScript (no TypeScript)
- `@sveltejs/vite-plugin-svelte` 7
- No router, no state library. Single-screen app in `src/App.svelte`
- Framework-agnostic app code (OWM fetch, theme map, derived-value helpers,
  full stylesheet, sample payload) lives in `../shared/` — import it via
  `../../shared/` paths rather than duplicating
- Static deploy to Firebase Hosting (`dist/` output)

## Commands

- `npm run dev` - Vite dev server (default port 5173)
- `npm run build` - production build to `dist/`
- `npm run preview` - serve the production build locally
- `firebase deploy` - deploy `dist/` to Firebase Hosting

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

- `.firebaserc` points to a `weathernow` Firebase project. The old app used
  `weathernow-old`; verify the target before the first real deploy
- 2 low-severity `npm audit` findings via `deepmerge` inside
  `@sveltejs/vite-plugin-svelte` (build-time only, no fix published yet)
