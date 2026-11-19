import sampleWeather from './sample-weather.js'

const API_URL = 'https://api.openweathermap.org/data/2.5/weather'

export const THEMES = {
  Clear: 'clear',
  Clouds: 'clouds',
  Rain: 'rain',
  Drizzle: 'rain',
  Mist: 'fog',
  Fog: 'fog',
  Haze: 'fog',
  Thunderstorm: 'storm',
  Snow: 'snow',
}

export function themeFor(weather) {
  return weather ? (THEMES[weather.weather[0].main] ?? 'default') : 'default'
}

export function toCelsius(weather) {
  return Math.round(((weather.main.temp - 32) * 5) / 9)
}

function localClock(unixSeconds, timezone) {
  return new Date((unixSeconds + timezone) * 1000).toUTCString().slice(17, 22)
}

export function toLocalTime(weather) {
  return `${localClock(weather.dt, weather.timezone)} local`
}

export function toSunTimes(weather) {
  return `${localClock(weather.sys.sunrise, weather.timezone)} / ${localClock(weather.sys.sunset, weather.timezone)}`
}

export function toVisibility(weather) {
  return weather.visibility == null ? 'n/a' : `${(weather.visibility / 1609.344).toFixed(1)} mi`
}

export async function fetchWeather(term, apiKey) {
  if (!apiKey) return { ...sampleWeather, demo: true }
  const method = /^\d{5}$/.test(term) ? 'zip' : 'q'
  const res = await fetch(
    `${API_URL}?${method}=${encodeURIComponent(term)}&appid=${apiKey}&units=imperial`
  )
  if (!res.ok) {
    throw new Error(res.status === 404 ? `"${term}" not found` : `Request failed (${res.status})`)
  }
  return res.json()
}
