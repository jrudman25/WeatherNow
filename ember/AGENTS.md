# AGENTS.md

## Stack

- Ember 7 Octane via `@embroider/vite` (Vite + Embroider build), plain
  JavaScript with `.gjs` template-tag components
- `ember-cli` 7.3 + `ember-source` 7.3 — pinned behind latest for
  min-release-age
- Single-screen app: `app/components/weather-app.gjs`, rendered by
  `app/templates/application.gjs`
- Framework-agnostic app code lives in `../shared/` — imported via
  `../../../shared/` paths rather than duplicating. `app.js` imports
  `../../shared/app.css` (embroider's virtual `app.css` does NOT resolve
  CSS `@import`)
- Builds to `dist/` via `vite build`; no per-implementation hosting config
  (`site/` owns the repo's single deploy)

## Commands

- `npm run dev` - Vite dev server (default port 5173)
- `npm run build` - production build to `dist/`
- `npm run preview` - serve the production build locally

## Conventions

- Octane idioms: `@tracked` state, `@action` handlers, `{{on}}` modifier,
  `{{#if}}`/`{{#unless}}` conditionals, getters for derived values
  (templates can't call `Math.round` etc.); no `and`/`not` helpers — those
  come from ember-truth-helpers, which isn't installed
- `locationType: 'none'` in `config/environment.js` — the router never
  touches the URL, so the app boots identically at `/ember/` or anywhere
  else; `rootURL` stays `/ember/` for resolver conventions
- `base: './'` in vite.config.mjs so built assets resolve under `/ember/`
- Secrets in `.env` as `VITE_*` via `import.meta.env` (it's a real Vite
  build); `.env.example` documents required keys
- Trimmed from the `ember init` blueprint: tests/testem, eslint/stylelint/
  prettier/template-lint configs, ember-data (`@warp-drive/*`), and
  `ember-page-title`. `ember-cli-build.mjs` is kept minimal for tooling
  compatibility — don't re-add the `@warp-drive` build-config block
- No `"type": "module"` in package.json — `config/*.js` are CJS
  (`module.exports`) by ember convention; `.mjs` covers the ESM configs
- npm `min-release-age` is 7 days; pin new deps to versions published at
  least a week ago

## Notes

- **Windows without Developer Mode**: `@embroider/vite` fails with
  `EPERM ... symlink` — it shells out to `fs.symlink` for temp "jump"
  packages. Local workaround: patch
  `node_modules/@embroider/vite/dist/src/resolver.js` to pass `'junction'`
  to `ensureSymlinkSync` (junctions need no elevation). Local-only —
  `npm ci` and CI rebuild node_modules anyway. Better: enable Developer
  Mode so real symlinks work.
- First cold build is slow (~1.5 min compat-prebuild); the `tmp/` dir is
  gitignored cache
