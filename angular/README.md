# WeatherNow (Angular)

A modern, art-directed weather experience built with Angular 22 (standalone
components, signals, zoneless change detection) and the `@angular/build`
toolchain. Live conditions come from the OpenWeatherMap API, and the backdrop
shifts to match the sky outside.

## Features

- City or ZIP search with live conditions
- Animated gradient sky themes driven by current weather
- Temperature (F/C), conditions, cloud cover, wind speed and direction, humidity
- Builds to `dist/browser/`

## Getting started

```sh
npm install
cp src/environments/environment.example.ts src/environments/environment.ts
# then add your OpenWeatherMap key to environment.ts
npm run dev            # ng serve, default port 4200
```

Get a free API key at <https://home.openweathermap.org/api_keys>.

## Build

```sh
npm run build         # outputs to dist/browser/, deployable to any static host
npm run preview       # serves dist/browser/ locally on :5179
```

## Notes

- ZIP code searches assume 5-digit US ZIPs (`q` search is used otherwise).
- Sky themes map from the OpenWeatherMap `weather.main` condition groups.
- API keys use the Angular `environments/` file convention (gitignored
  `environment.ts`) rather than `.env` — Angular has no `import.meta.env`.
