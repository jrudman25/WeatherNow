# WeatherNow (Astro)

The Astro implementation — static HTML plus a processed `<script>` tag, no
framework island. Astro compiles everything away: the production build is a
single self-contained `index.html` with the app JS and CSS inlined, so it
ships zero separate asset files.

```sh
npm install
npm run dev      # http://localhost:4321/astro/
npm run build    # astro build to dist/
npm run preview  # serve the production build locally
```

## API key

```sh
cp .env.example .env
# edit .env — set PUBLIC_OWM_API_KEY
```

Note the `PUBLIC_` prefix — Astro only exposes `PUBLIC_*` env vars to
client-side code. Without a key, the app still works: `fetchWeather()`
returns bundled San Francisco sample data, and the UI marks it with a demo
banner + badge.

## Notes

- `base: '/astro'` in `astro.config.mjs` — Astro doesn't support relative
  bases, so the deploy subpath is hardcoded (same as alpine/ and vanilla/)
- Without a framework island, interactivity is plain DOM updates — the
  same shape of code as `vanilla/`, which is the point of the comparison
