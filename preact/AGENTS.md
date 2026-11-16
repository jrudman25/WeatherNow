# AGENTS.md

## Stack

- Preact 11 + Vite 8, plain JavaScript/JSX (no TypeScript)
- `@preact/preset-vite` 2
- No router, no state library. Single-screen app in `src/App.jsx`
- Framework-agnostic app code (OWM fetch, theme map, derived-value helpers,
  full stylesheet, sample payload) lives in `../shared/` — import it via
  `../../shared/` paths rather than duplicating
- Builds to `dist/`; no per-implementation hosting config (the repo plans a
  single aggregate site, not one deploy per framework)

## Commands

- `npm run dev` - Vite dev server (default port 5173)
- `npm run build` - production build to `dist/`
- `npm run preview` - serve the production build locally

## Conventions

- Function components + hooks (`useState`) only; `import { render } from 'preact'`
  in `src/main.jsx`
- Preact-idiomatic DOM props: `class` (not `className`), `onInput` (not
  `onChange`), lowercase `autocomplete`
- No transition library: mount animations are CSS keyframes in
  `shared/app.css`; the weather report uses `key={weather.dt}` to remount and
  replay on each fetch
- Styles are the shared global stylesheet `../shared/app.css` (no SFC scoped
  styles like Svelte)
- Secrets go in `.env` as `VITE_*` vars, read via `import.meta.env`. Never
  commit `.env`; `.env.example` documents required keys
- Weather themes map OpenWeatherMap `weather.main` groups to CSS classes that
  set `--c1`/`--c2` gradient stops on `.scene`
- npm `min-release-age` is 7 days; pin new deps to versions published at least
  a week ago

