# AGENTS.md

## Stack

- React 19 + Vite 8, plain JavaScript/JSX (no TypeScript)
- `@vitejs/plugin-react` 6
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

- Function components + hooks (`useState`) only; `createRoot` from
  `react-dom/client` + `<StrictMode>` in `src/main.jsx`
- React DOM props: `className`, `onChange`, `autoComplete` (vs Preact's
  `class`/`onInput`/`autocomplete`) — the deliberate diff against `preact/`
- No transition library: mount animations are CSS keyframes in
  `shared/app.css`; the report uses `key={weather.dt}` to remount and replay
- `base: './'` in vite.config so built assets resolve under `/<name>/`
- Secrets in `.env` as `VITE_*` via `import.meta.env`; `.env.example`
  documents required keys
- npm `min-release-age` is 7 days; pin new deps to versions published at
  least a week ago
