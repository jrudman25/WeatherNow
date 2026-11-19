# WeatherNow (Ember)

The Ember implementation — Octane edition via the modern `@embroider/vite`
pipeline (Vite build, `.gjs` template-tag components). The fullest-featured
framework in the lineup and the largest runtime: ~100 KB gzipped before the
app code does anything.

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build locally
```

## API key

```sh
cp .env.example .env
# edit .env — set VITE_OWM_API_KEY
```

Without a key, the app still works: `fetchWeather()` returns bundled San
Francisco sample data, and the UI marks it with a demo banner + badge.

## Notes

- Ember idioms vs the others: `@tracked` + `@action`, `{{on}}` modifiers,
  `{{#if}}`/`{{#unless}}`, getters for derived template values
- `locationType: 'none'` — the router ignores the URL entirely, so the app
  boots at `/ember/` or any path
- On Windows without Developer Mode the build fails on symlink EPERM —
  enable Developer Mode, or see the workaround in `AGENTS.md`
