# AGENTS.md

## Stack

- Astro 7, static output (default — no adapter, no SSR)
- No framework island: the whole page is `src/pages/index.astro` — markup
  plus a processed `<script>` that Astro bundles inline into the HTML.
  The build emits a single self-contained `index.html` (CSS and JS inlined)
- Client env vars need the `PUBLIC_` prefix: `PUBLIC_OWM_API_KEY` read via
  `import.meta.env` (Astro does not expose `VITE_*` to client scripts)
- Framework-agnostic app code lives in `../shared/` — imported by the page
  script and frontmatter via `../../../shared/` paths
- Builds to `dist/`; no per-implementation hosting config (`site/` owns the
  repo's single deploy)

## Commands

- `npm run dev` - Astro dev server on :4321, app at `/astro/`
- `npm run build` - `astro build` to `dist/`
- `npm run preview` - `astro preview` serves `dist/`

## Conventions

- `base: '/astro'` in astro.config.mjs — Astro has no relative-base option,
  so it takes a literal path prefix (same tradeoff as alpine/vanilla's
  hardcoded `<base href>`)
- Interactivity without an island means plain DOM updates via
  `getElementById` + `textContent`, visibility via `hidden` — same approach
  as `vanilla/`, including `hasResult` so a failed search keeps the last
  report visible
- `astro` stays in `devDependencies` — it's a build tool; nothing is
  imported by the browser as a library
- Secrets in `.env` as `PUBLIC_*` via `import.meta.env`; `.env.example`
  documents required keys
- npm `min-release-age` is 7 days; pin new deps to versions published at
  least a week ago (astro itself is pinned behind latest for this reason)

## Notes

- `astro dev` serves the app at `/astro/` (because of `base`), not `/`
- The inlined bundle means `stats.json` counts `jsBytes` from the inline
  `<script>` — the comparison is still fair: that's all the JS it ships
