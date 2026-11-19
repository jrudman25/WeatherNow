# WeatherNow (Next.js)

The Next.js implementation — App Router, statically exported. `page.jsx` is a
server component wrapping a `'use client'` weather component, so it ships the
RSC/hydration split, but with `output: 'export'` there is no server at
runtime — Firebase Hosting serves plain files.

```sh
npm install
npm run dev      # http://localhost:3000/nextjs
npm run build    # static export to out/
```

## API key

```sh
cp .env.example .env
# edit .env — set NEXT_PUBLIC_OWM_API_KEY
```

Without a key, the app still works: `fetchWeather()` returns bundled San
Francisco sample data, and the UI marks it with a demo banner + badge.

## Notes

- `basePath: '/nextjs'` makes generated asset URLs absolute under the
  deploy subpath — the export only works at `/nextjs/`, same tradeoff as
  `astro/`/`alpine/`/`vanilla/`
- `turbopack.root` points at the repo root so `../../shared/` imports
  resolve; without it Turbopack refuses files outside the project dir
