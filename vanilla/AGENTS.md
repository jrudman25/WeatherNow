# AGENTS.md

## Stack

- Vanilla JavaScript — zero framework, zero bundler, zero npm dependencies
- Native ES modules; `app.js` imports from `../shared/weather.js` directly
- The baseline impl: every other impl shows what a framework adds on top

## Commands

- `npm run dev` - `server.mjs` static server on :5179 (maps `/`, `/vanilla/*`,
  `/shared/*`)
- `npm run build` - `build.mjs` stages `dist/` (`dist/vanilla/` next to
  `dist/shared/`, preserving `../shared/` references)
- `npm run preview` - serve staged `dist/` on :5179

## Conventions

- Secrets: `config.js` sets `window.CONFIG.API_KEY` — gitignored;
  `config.example.js` documents the shape and is copied to `config.js` in CI
- DOM updates via `getElementById` + `textContent`; visibility via `hidden`
  (`.demo` badge uses `style.display` — `hidden` loses to its
  `display: inline-block` author rule)
- `<base href="/vanilla/">` makes relative refs resolve at the site's
  `/vanilla/` subpath and at `/` in dev
- Report visibility matches other impls: hidden while loading and before
  first result (`weather && !loading`)
