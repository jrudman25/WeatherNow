# WeatherNow (Vanilla JS)

The baseline implementation — no framework, no build step. Static markup in
`index.html`, populated by `app.js` with plain DOM APIs (`getElementById`,
`textContent`, the `hidden` attribute). Every other implementation exists to
show what a framework adds on top of this.

Dev server (dependency-free):

```sh
npm run dev   # http://localhost:5179 — serves /, /vanilla/*, /shared/*
```

`npm run build` stages `dist/` (`dist/vanilla/` next to `dist/shared/`);
`npm run preview` serves it.

## API key

```sh
cp config.example.js config.js
# edit config.js — set window.CONFIG.API_KEY
```

Without a key, the app still works: `fetchWeather()` returns bundled San
Francisco sample data, and the UI marks it with a demo banner + badge.

## Notes

- `config.js` is gitignored — never commit it.
- Transitions come for free: `hidden` → visible replays the shared `app.css`
  keyframe animations.
- This is a fresh implementation of the shared app, not a port of
  `weathernowold` (the original project's code lives in its own archived repo).
