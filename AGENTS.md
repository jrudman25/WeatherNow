# AGENTS.md

## Repo layout

- Multi-framework playground: the same single-screen weather app
  reimplemented per stack. Each `<stack>/` subfolder is self-contained with
  its own `package.json`, `README.md`, and `AGENTS.md` — read the per-impl
  AGENTS.md before editing that implementation.
- `shared/` holds framework-agnostic app code imported by every impl:
  - `weather.js` — THEMES map, `fetchWeather(term, apiKey)`, `themeFor`,
    `toCelsius`, `toLocalTime`
  - `app.css` — the complete stylesheet; identical visuals across impls is
    the point of the comparison
  - `sample-weather.js` — bundled OWM payload returned by `fetchWeather`
    when `apiKey` is falsy; return object gets `demo: true` and UIs show
    `.demo-banner`/`.demo`
- Keep implementations functionally and visually identical: app logic and
  styles belong in `shared/`, only the framework's expression of them lives
  in the impl.
- `site/` is the aggregate comparison site and single deployable artifact —
  vanilla HTML/JS landing page with no dependencies. `build.mjs` builds every
  impl, stages `dist/<name>/`, and emits `stats.json`
- Other top-level folders (`react/`, `django/`, etc.) are empty placeholders
  for future implementations.

## Conventions

- Plain JavaScript everywhere except `angular/` (TypeScript — Angular
  requires it)
- No per-implementation hosting config. `site/` owns the repo's single
  Firebase deploy (`site/firebase.json` + `.firebaserc` targeting project ID
  `weathernow-fab1e`, `public: dist`) — run `firebase deploy` from `site/`;
  live at https://weathernow-fab1e.web.app
- Secret API keys by stack convention, all gitignored with a committed
  `*.example` file documenting each format:
  - Vite impls: `.env` with `VITE_OWM_API_KEY`, read via `import.meta.env`
  - `alpine/` (no bundler): `config.js` setting `window.CONFIG.API_KEY`
  - `angular/`: `src/environments/environment.ts`
- Impls build with relative asset URLs so they work at `/<name>/` subpaths
  under `site/dist/`: `base: './'` in vite.config (`lit/` uses
  `vite build --base=./` to keep its no-config story), `baseHref` in
  angular.json; `alpine/`'s `<base href="/alpine/">` already aligns
- npm `min-release-age` is 7 days globally; pin new deps to versions
  published at least a week ago
- `.gitattributes` normalizes text files to LF on commit

## Commands

- Per impl: `cd <impl> && npm install && npm run dev`
  - Vite impls (svelte, preact, vue, lit): Vite dev server
  - `alpine/`: `server.mjs` on :5176; `vanilla/`: `server.mjs` on :5179
  - `angular/`: `ng serve` on :4200
- `npm run build` produces `dist/` (Angular: `dist/browser/`; Alpine:
  `build.mjs` stages `dist/` preserving the `shared/` sibling layout)
- `cd site && npm run build` - full site build; `npm run stage` re-stages
  from existing impl output; `npm run preview` serves `dist/` on :5180

## Notes

- `TODO.md` is excluded from git via `.git/info/exclude` — it stays local
- `weathernowold/` (the original vanilla JS app) is a separate project
  outside this repo
