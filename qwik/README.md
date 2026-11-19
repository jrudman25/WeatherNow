# WeatherNow (Qwik)

The Qwik implementation — the resumability counterpoint in the lineup.
Instead of hydrating a server-rendered page, Qwik serializes state into
the DOM and lazy-loads event handlers as QRLs: the build emits a dozen
tiny chunks, and only the `search` handler's code downloads when you
actually submit the form.

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

- `qwikVite({ csr: true })` keeps this client-side only (no SSR, no Qwik
  City), so `index.html` is the Vite entry just like the other impls
- Qwik idioms vs the others: `component$`, `useSignal().value`,
  `onSubmit$` QRLs, `preventdefault:submit`, `bind:value`
- Vite is pinned to 7.x here — `@builder.io/qwik` requires `vite >=5 <8`
