import {
  themeFor,
  toCelsius,
  toLocalTime,
  toSunTimes,
  toVisibility,
  fetchWeather,
} from '../shared/weather.js'

const $ = (id) => document.getElementById(id)

const scene = $('scene')
const query = $('query')
const btn = $('search-btn')
const error = $('error')
const report = $('report')
const demoBanner = $('demo-banner')
const demoBadge = $('demo-badge')

let hasResult = false

$('search-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const term = query.value.trim()
  if (!term) return

  error.hidden = true
  report.hidden = true
  btn.disabled = true
  btn.textContent = '...'

  try {
    const weather = await fetchWeather(term, window.CONFIG?.API_KEY)
    scene.className = `scene ${themeFor(weather)}`
    $('city').textContent = `${weather.name}, ${weather.sys.country}`
    $('temp').textContent = Math.round(weather.main.temp)
    $('temp-c').textContent = `/ ${toCelsius(weather)}°C`
    $('desc').textContent = weather.weather[0].description
    $('local-time').textContent = toLocalTime(weather)
    $('feels-like').textContent = `${Math.round(weather.main.feels_like)}°F`
    $('humidity').textContent = `${weather.main.humidity}%`
    $('wind').textContent =
      `${Math.round(weather.wind.speed)} mph at ${Math.round(weather.wind.deg)}°`
    $('clouds').textContent = `${weather.clouds.all}%`
    $('visibility').textContent = toVisibility(weather)
    $('sun-times').textContent = toSunTimes(weather)
    demoBanner.hidden = !weather.demo
    demoBadge.style.display = weather.demo ? '' : 'none'
    report.hidden = false
    hasResult = true
  } catch (e) {
    error.textContent = e.message
    error.hidden = false
    report.hidden = !hasResult
  } finally {
    btn.disabled = false
    btn.textContent = 'Search'
  }
})
