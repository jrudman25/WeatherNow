# WeatherNow (Alpine)

A modern, art-directed weather experience built with Alpine.js 3. Live
conditions come from the OpenWeatherMap API, and the backdrop shifts to match
the sky outside.

Unlike the Vite-based implementations, this one has **no build step**: Alpine
is a vendored drop-in script (`vendor/alpine.min.js`) and reactivity lives in
`x-*` directives directly in `index.html`.

## Features

- City or ZIP search with live conditions
- Animated gradient sky themes driven by current weather
- Temperature (F/C), conditions, cloud cover, wind speed and direction, humidity
- Static site, builds to `dist/`

## Getting started

```sh
cp config.example.js config.js   # then add your OpenWeatherMap key
npm run dev                      # open http://localhost:5176
```

Get a free API key at <https://home.openweathermap.org/api_keys>.

`server.mjs` maps `/shared/*` to `../shared/` and `/alpine/*` (plus `/`) to
this directory, so no bundler or external tooling is needed.

## Build

```sh
npm run build       # stages dist/ preserving the sibling shared/ layout
npm run preview     # serve the staged build locally on :5176
```

## Notes

- ZIP code searches assume 5-digit US ZIPs (`q` search is used otherwise).
- Sky themes map from the OpenWeatherMap `weather.main` condition groups.
