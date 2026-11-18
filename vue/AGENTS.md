# AGENTS.md

## Stack

- Vue 3.5 (Composition API, `<script setup>`) + Vite 8, plain JavaScript
- `@vitejs/plugin-vue` 6
- No router, no state library. Single-screen app in `src/App.vue`
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

- Composition API with `<script setup>`: `ref()` for state, `computed()` for
  derived values; access `.value` in script, bare names in templates
- Vue-idiomatic template directives: `v-model`, `v-if`, `:class`, `:disabled`,
  `@submit.prevent`, `{{ }}` interpolation
- Transitions use the built-in `<Transition>` component with named classes;
  the scoped `<style>` block disables the shared keyframe animations
- Secrets go in `.env` as `VITE_*` vars, read via `import.meta.env`. Never
  commit `.env`; `.env.example` documents required keys
- Weather themes map OpenWeatherMap `weather.main` groups to CSS classes that
  set `--c1`/`--c2` gradient stops on `.scene` (defined in `shared/`)
- npm `min-release-age` is 7 days; pin new deps to versions published at least
  a week ago
