# AGENTS.md

## Stack

- Qwik 1 + Vite 7, plain JavaScript/JSX (no TypeScript)
- `qwikVite({ csr: true })` — client-side rendering only, no SSR and no
  Qwik City router; `index.html` is the Vite entry like the other impls
- Vite is pinned to 7.x (not 8 like the other impls): `@builder.io/qwik`'s
  peer range is `>=5 <8`
- No router, no state library. Single-screen app in `src/app.jsx`
- Framework-agnostic app code lives in `../shared/` — import via
  `../../shared/` paths rather than duplicating
- Builds to `dist/`; no per-implementation hosting config (`site/` owns the
  repo's single deploy)

## Commands

- `npm run dev` - Vite dev server (default port 5173)
- `npm run build` - production build to `dist/`
- `npm run preview` - serve the production build locally

## Conventions

- `src/main.jsx` MUST `await import('@builder.io/qwik/qwikloader.js')`
  before `render()` — the loader registers the delegated event listeners
  the container dispatches through; without it every event falls through
  to native behavior (e.g. form submit reloads the page). A static bare
  import is tree-shaken (`@builder.io/qwik` is `sideEffects: false`), so
  it must be dynamic
- Resumability instead of hydration: components use `component$`, state
  uses `useSignal` (read/write `.value`), and event handlers are QRLs via
  `$()` / `onXyz$` — the optimizer splits them into lazy chunks, so the
  build emits many small `app.jsx_*` files plus `q-manifest.json`
- Idiomatic event props: `preventdefault:submit` instead of
  `e.preventDefault()`, `bind:value={signal}` for two-way input binding
- `$()` closures may reference module-scope constants (e.g. `API_KEY`) but
  captured locals must be serializable — signals and plain data are fine
- `@builder.io/qwik` stays in `devDependencies` (upstream convention; the
  optimizer complains if qwik packages land in `dependencies`)
- `base: './'` in vite.config so built assets resolve under `/qwik/`;
  Qwik resolves its lazy chunks relative to `import.meta.url`/`baseURI`,
  so subpaths work — vite warns `base` must begin/end with `/` in CSR mode,
  but `'./'` builds and deploys correctly
- Secrets in `.env` as `VITE_*` via `import.meta.env`; `.env.example`
  documents required keys
- npm `min-release-age` is 7 days; pin new deps to versions published at
  least a week ago
