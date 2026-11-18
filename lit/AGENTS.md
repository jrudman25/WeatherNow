# AGENTS.md

## Stack

- Lit 3 (Web Components / `LitElement`) + Vite 8, plain JavaScript
- **No Vite plugin** — template literals work natively; `vite.config.js` is
  intentionally absent
- Single custom element `<weather-app>` in `src/weather-app.js`, mounted in
  `index.html`
- Framework-agnostic app code (OWM fetch, theme map, derived-value helpers,
  full stylesheet, sample payload) lives in `../shared/` — import it via
  `../../shared/` paths rather than duplicating
- Builds to `dist/`; no per-implementation hosting config (`site/` owns the
  repo's single deploy)

## Commands

- `npm run dev` - Vite dev server (default port 5173)
- `npm run build` - production build to `dist/`
- `npm run preview` - serve the production build locally

## Conventions

- No decorators — plain JS `static properties` + `state: true` fields (the
  repo avoids TypeScript; decorators would require it)
- Derived state is plain JS getters on the element
- lit-html binding syntax: `.prop=${}` (property), `?attr=${}` (boolean
  attribute), `@event=${}` (listener), `${cond ? html`...` : nothing}`
- **Shadow DOM**: global styles are blocked by design — `shared/app.css` is
  injected via `import css from '...app.css?inline'` + `unsafeCSS` in
  `static styles`; `main.js` also imports it globally for `:root`/`body`
  chrome outside the shadow root
- No transition system (like Preact): the keyframe mount animations in
  `shared/app.css` replay automatically because conditional templates create
  fresh DOM nodes on each render
- Secrets go in `.env` as `VITE_*` vars, read via `import.meta.env`. Never
  commit `.env`; `.env.example` documents required keys
- npm `min-release-age` is 7 days; pin new deps to versions published at least
  a week ago
