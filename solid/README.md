# WeatherNow (Solid)

The SolidJS implementation — signals-based, JSX, compiled with **no virtual
DOM**. Looks like React but reactivity is fine-grained: the template compiles
to real DOM operations, so the runtime is the smallest of any compiled impl
here (~6 kB gzipped).

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

- Signals not state: `createSignal` returns `[read, write]` — values are read
  by *calling* them (`weather().name`), updates are fine-grained (no
  re-render pass at all)
- `<Show when={...}>` replaces JSX `&&`/ternary conditionals — it unmounts
  during loading, which is what replays the CSS enter animation each fetch
- Uses `class`/`onInput` like Preact — Solid's JSX is DOM-faithful, not
  React-normalized (`className`/`onChange`/`autoComplete`)
