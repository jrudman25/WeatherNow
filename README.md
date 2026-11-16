# WeatherNow

A multi-framework weather app playground. The same single-screen weather app
is implemented in several frontend stacks so each framework's component
model, reactivity, templating, and tooling can be compared side by side. Live
conditions come from the OpenWeatherMap API, and the backdrop shifts to match
the current weather.

## Implementations

| Folder | Stack | Toolchain |
|---|---|---|
| `svelte/` | Svelte 5 (runes) | Vite |
| `preact/` | Preact 11 (hooks) | Vite |
| `vue/` | Vue 3 (Composition API, `<script setup>`) | Vite |
| `lit/` | Lit 3 (Web Components, shadow DOM) | Vite, no plugin |
| `alpine/` | Alpine.js 3 (vendored) | No build step — `server.mjs` |
| `angular/` | Angular 22 (standalone, signals, zoneless) + TypeScript | Angular CLI (`angular.json`) |

## Layout

- `shared/` — framework-agnostic app code used by every implementation:
  `weather.js` (OpenWeatherMap fetch, theme map, derived-value helpers),
  `app.css` (the complete stylesheet), `sample-weather.js` (demo fixture),
  `README.md` (the contract)
- `<impl>/` — one folder per stack, each self-contained with its own
  `package.json`, `README.md`, and `AGENTS.md`

## Running an implementation

```sh
cd svelte          # or preact, vue, lit
npm install
npm run dev
```

Alpine has no bundler: `cd alpine && npm run dev`, then open
http://localhost:5176.

Angular uses its own toolchain: `cd angular && npm install && npm run dev`,
then open http://localhost:4200.

## API key (optional)

Implementations read an OpenWeatherMap key through whatever convention fits
the stack — `.env` with `VITE_OWM_API_KEY` for the Vite apps,
`config.js` for Alpine, `src/environments/environment.ts` for Angular. Each
folder includes an `*.example` file documenting its format.

Without a key, `fetchWeather()` returns a bundled sample payload and the UI
marks it as demo data, so a fresh clone still renders the full app.

Free key: <https://home.openweathermap.org/api_keys>
