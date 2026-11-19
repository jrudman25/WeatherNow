// Canned OpenWeatherMap current-weather response (San Francisco, clear).
// Used by fetchWeather() when no API key is configured, so a fresh clone
// still renders the full themed UI.
export default {
  coord: { lon: -122.4194, lat: 37.7749 },
  weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
  base: 'stations',
  main: { temp: 72.3, feels_like: 71.8, humidity: 55 },
  visibility: 10000,
  wind: { speed: 8.2, deg: 270 },
  clouds: { all: 5 },
  dt: 1763232000,
  sys: { country: 'US', sunrise: 1763218200, sunset: 1763254620 },
  timezone: -28800,
  id: 5391959,
  name: 'San Francisco',
  cod: 200,
}
