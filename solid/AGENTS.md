# AGENTS.md

## Stack

- Solid 1.9 + Vite 8, plain JavaScript/JSX (no TypeScript)
- `vite-plugin-solid` 2.11
- No router, no state library. Single-screen app in `src/App.jsx`
- Framework-agnostic app code lives in `../shared/` — import via
  `../../shared/` paths rather than duplicating
- Builds to `dist/`; no per-implementation hosting config (`site/` owns the
  repo's single deploy)

## Commands

- `npm run dev` - Vite dev server (default port 5173)
- `npm run build` - production build to `dist/`
- `npm run preview` - serve the production build locally

## Conventions

- Signals only: `createSignal` → `[read, write]`; read by calling
  (`weather()`), derived values are plain expressions — fine-grained
  reactivity, no VDOM
- `<Show when={...}>` for conditionals (not JSX `&&`); the report's Show
  unmounts during loading, replaying the shared CSS enter animation each
  fetch — no `key` trick needed
- DOM-faithful props: `class`, `onInput`, `autocomplete`, `e.currentTarget`
- `base: './'` in vite.config so built assets resolve under `/<name>/`
- Secrets in `.env` as `VITE_*` via `import.meta.env`; `.env.example`
  documents required keys
- npm `min-release-age` is 7 days; pin new deps to versions published at
  least a week ago
