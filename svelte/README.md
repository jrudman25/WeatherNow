# WeatherNow

A modern, art-directed weather experience built with Svelte 5 and Vite. Live
conditions come from the OpenWeatherMap API, and the backdrop shifts to match
the sky outside.

## Features

- City or ZIP search with live conditions
- Animated gradient sky themes driven by current weather
- Temperature (F/C), conditions, cloud cover, wind speed and direction, humidity
- Static site, deploys to Firebase Hosting

## Getting started

```sh
npm install
cp .env.example .env   # then add your OpenWeatherMap key
npm run dev
```

Get a free API key at <https://home.openweathermap.org/api_keys>.

## Build and deploy

```sh
npm run build       # outputs to dist/
firebase deploy     # serves dist/ via Firebase Hosting
```

## Notes

- ZIP code searches assume 5-digit US ZIPs (`q` search is used otherwise).
- Sky themes map from the OpenWeatherMap `weather.main` condition groups.
