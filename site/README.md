# WeatherNow Site

The aggregate comparison site — the repo's single deployable artifact. A
vanilla HTML/JS landing page links every implementation and shows live
comparison stats (bundle size, LOC, dependency count, build time) generated at
build time.

## Build and preview

```sh
npm run build     # builds every impl, stages dist/<name>/, emits stats.json
npm run stage     # re-stages from existing impl dist/ output (no rebuilds)
npm run preview   # serves dist/ on http://localhost:5180
```

`build.mjs` runs `npm run build` inside each implementation directory, so impl
dependencies must be installed first (`npm install` per impl, once).

## Deploy

```sh
firebase deploy   # serves dist/ via Firebase Hosting
```

Deploy config (`firebase.json`, `.firebaserc`) targets the `weathernow-fab1e`
Firebase project; the site is live at https://weathernow-fab1e.web.app.

## Notes

- Implementations are served at `/<name>/` subpaths — Vite impls build with
  `base: './'`, Angular with `baseHref: './'`, and Alpine's `<base href="/alpine/">`
  already matches its subpath.
- Alpine additionally merges its `dist/shared/` staging into `site/dist/shared/`.
