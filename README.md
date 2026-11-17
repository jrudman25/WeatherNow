# WeatherNow

A multi-framework weather app playground. The same single-screen weather app
is implemented in several frontend stacks so each framework's component
model, reactivity, templating, and tooling can be compared side by side. Live
conditions come from the OpenWeatherMap API, and the backdrop shifts to match
the current weather.

**Live comparison site:** <https://weathernow-fab1e.web.app>

## Implementations

| Folder | Stack | Toolchain |
|---|---|---|
| `svelte/` | Svelte 5 (runes) | Vite |
| `preact/` | Preact 11 (hooks) | Vite |
| `vue/` | Vue 3 (Composition API, `<script setup>`) | Vite |
| `lit/` | Lit 3 (Web Components, shadow DOM) | Vite, no plugin |
| `alpine/` | Alpine.js 3 (vendored) | No build step — `server.mjs` |
| `vanilla/` | Plain DOM APIs (baseline) | No build step — `server.mjs` |
| `angular/` | Angular 22 (standalone, signals, zoneless) + TypeScript | Angular CLI (`angular.json`) |

## Layout

- `shared/` — framework-agnostic app code used by every implementation:
  `weather.js` (OpenWeatherMap fetch, theme map, derived-value helpers),
  `app.css` (the complete stylesheet), `sample-weather.js` (demo fixture),
  `README.md` (the contract)
- `<impl>/` — one folder per stack, each self-contained with its own
  `package.json`, `README.md`, and `AGENTS.md`
- `site/` — the aggregate comparison site and the repo's single deployable
  artifact: a vanilla HTML/JS landing page linking every implementation with
  live stats (bundle size, lines of code, dependencies, build time)

## Running an implementation

```sh
cd svelte          # or preact, vue, lit
npm install
npm run dev
```

Alpine and Vanilla have no bundler: `cd alpine` (or `vanilla`) `&& npm run
dev`, then open http://localhost:5176 (vanilla: http://localhost:5179).

Angular uses its own toolchain: `cd angular && npm install && npm run dev`,
then open http://localhost:4200.

## Building the comparison site

```sh
cd site
npm run build    # builds every impl, stages dist/<name>/, emits stats.json
npm run preview  # serves dist/ on http://localhost:5180
```

Impl dependencies must be installed first (`npm install` per impl, once).
`npm run stage` re-stages the site from existing impl `dist/` output without
rebuilding. Deploys to Firebase Hosting with `firebase deploy` from `site/`.

## API key (optional)

Implementations read an OpenWeatherMap key through whatever convention fits
the stack — `.env` with `VITE_OWM_API_KEY` for the Vite apps,
`config.js` for Alpine, `src/environments/environment.ts` for Angular. Each
folder includes an `*.example` file documenting its format.

Without a key, `fetchWeather()` returns a bundled sample payload and the UI
marks it as demo data, so a fresh clone still renders the full app.

Free key: <https://home.openweathermap.org/api_keys>
