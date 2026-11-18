# WeatherNow (React)

The React 19 implementation — the canonical `useState` + JSX version, and the
headline pair against `preact/`: near-identical code, very different bundle.
React's `react-dom` costs roughly 10x the gzipped bytes of Preact's runtime for
the same app.

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

- React idioms vs Preact's: `className`, `onChange`, `autoComplete`,
  `createRoot`, and `<StrictMode>` (dev double-render — the React-specific
  check for impure render code)
- Same `key={weather.dt}` remount trick as preact/ to replay the CSS
  enter animation on each fetch
