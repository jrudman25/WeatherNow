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
- Empty top-level folders (`jquery/`, `nuxt/`) are local placeholders for
  future implementations; git doesn't track them until they have files.
- Every impl renders `<a class="back" href="/">Back to comparisons</a>` as
  the first child of `.panel`; styling (including the arrow) lives in
  `shared/app.css`.

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
  - `astro/`: `.env` with `PUBLIC_OWM_API_KEY` (Astro exposes only
    `PUBLIC_*` vars to client scripts)
  - `nextjs/`: `.env` with `NEXT_PUBLIC_OWM_API_KEY` (Next exposes only
    `NEXT_PUBLIC_*` vars to client code)
  - `alpine/` and `vanilla/` (no bundler): `config.js` setting
    `window.CONFIG.API_KEY`
  - `angular/`: `src/environments/environment.ts`
  - CI deploy writes all of these from the `OWM_API_KEY` GitHub Actions
    secret (empty if unset, giving demo data). The key is public in client JS
    by design; impl build-check jobs still copy the `*.example` files
- Impls build with relative asset URLs so they work at `/<name>/` subpaths
  under `site/dist/`: `base: './'` in vite.config (`lit/` uses
  `vite build --base=./` to keep its no-config story), `baseHref` in
  angular.json; `alpine/`'s `<base href="/alpine/">`, `vanilla/`'s
  `<base href="/vanilla/">`, `astro/`'s `base: '/astro'` (Astro has no
  relative-base option), and `nextjs/`'s `basePath: '/nextjs'` already align
- New impls may need a `Cache-Control` rule in `site/firebase.json`
  (unhashed output → `/<name>/**` `no-cache`); see `site/AGENTS.md`
- npm `min-release-age` is 7 days globally; pin new deps to versions
  published at least a week ago
- `.gitattributes` normalizes text files to LF on commit

## Commands

- Per impl: `cd <impl> && npm install && npm run dev`
  - Vite impls (svelte, react, solid, preact, vue, lit, qwik, ember):
    Vite dev server
  - `alpine/`: `server.mjs` on :5176; `vanilla/`: `server.mjs` on :5179
  - `angular/`: `ng serve` on :4200
  - `astro/`: `astro dev` on :4321 (serves at `/astro/`)
  - `nextjs/`: `next dev` on :3000 (serves at `/nextjs`)
- `npm run build` produces `dist/` (Angular: `dist/browser/`; Next.js:
  `out/`; Alpine:
  `build.mjs` stages `dist/` preserving the `shared/` sibling layout)
- `cd site && npm run build` - full site build; `npm run stage` re-stages
  from existing impl output; `npm run preview` serves `dist/` on :5180;
  `npm run measure` refreshes committed `site/perf.json` (local Chrome via
  `playwright-core`; never run in CI)

## Notes

- `TODO.md` is excluded from git via `.git/info/exclude` — it stays local
- `weathernowold/` (the original vanilla JS app) is a separate project
  outside this repo
