# AGENTS.md

## Stack

- Alpine.js 3.17, vendored at `vendor/alpine.min.js` (no npm dependency, no CDN)
- Plain HTML + ES modules, **no build step** — no Vite, no bundler
- Single-screen app: markup and state live in `index.html` via `x-*` directives;
  component logic in `app.js` registered via `Alpine.data` on `alpine:init`
- Framework-agnostic app code (OWM fetch, theme map, derived-value helpers,
  full stylesheet, sample payload) lives in `../shared/` — imported via native
  ES modules and `<link>` tags
- `build.mjs` stages `dist/`; no per-implementation hosting config (`site/`
  owns the repo's single deploy)

## Commands

- `npm run dev` - `server.mjs` (dependency-free static server) on :5176; serves
  the app at `/` and maps `/shared/*` → `../shared/*`, `/alpine/*` → `./*`
- `npm run build` - `build.mjs` stages `dist/` (preserves `alpine/` + `shared/`
  sibling layout so `../shared/` references still resolve)
- `npm run preview` - `server.mjs dist` serves the staged build on :5176

## Conventions

- Alpine-idiomatic directives: `x-data`, `x-model`, `x-text`, `x-show`,
  `x-if` (inside `<template>`), `:class`, `@submit.prevent`
- Derived state is plain JS getters in the `Alpine.data` object
- Transitions use `x-transition.opacity.duration.300ms` (demo banner, error)
  and `x-transition:enter` classes (report); `alpine.css` disables the keyframe animations in `shared/app.css`
  and defines the transition classes instead
- API key: no `.env` without a bundler — `config.js` (gitignored) sets
  `window.CONFIG.API_KEY`; `config.example.js` documents the shape
- npm `min-release-age` is 7 days; pin new deps to versions published at least
  a week ago

## Notes

- `config.js` is listed in the repo-root `.gitignore`
