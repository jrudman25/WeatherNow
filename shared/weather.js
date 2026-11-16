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

export function toLocalTime(weather) {
  return `${new Date((weather.dt + weather.timezone) * 1000).toUTCString().slice(17, 22)} local`
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
