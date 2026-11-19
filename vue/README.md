# WeatherNow (Vue)

A modern, art-directed weather experience built with Vue 3 (Composition API)
and Vite. Live conditions come from the OpenWeatherMap API, and the backdrop
shifts to match the sky outside.

## Features

- City or ZIP search with live conditions
- Animated gradient sky themes driven by current weather
- Temperature (F/C), conditions, feels like, humidity, wind speed and direction, cloud cover, visibility, sunrise/sunset, local time
- Static site, builds to `dist/`

## Getting started

```sh
npm install
cp .env.example .env   # then add your OpenWeatherMap key
npm run dev
```

Get a free API key at <https://home.openweathermap.org/api_keys>.

## Build

```sh
npm run build       # outputs to dist/, deployable to any static host
```

## Notes

- ZIP code searches assume 5-digit US ZIPs (`q` search is used otherwise).
- Sky themes map from the OpenWeatherMap `weather.main` condition groups.
