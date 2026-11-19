import { useState } from 'preact/hooks'
import {
  themeFor,
  toCelsius,
  toLocalTime,
  toSunTimes,
  toVisibility,
  fetchWeather,
} from '../../shared/weather.js'

const API_KEY = import.meta.env.VITE_OWM_API_KEY

export function App() {
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const theme = themeFor(weather)
  const tempC = weather ? toCelsius(weather) : 0
  const localTime = weather ? toLocalTime(weather) : ''

  async function search(e) {
    e.preventDefault()
    const term = query.trim()
    if (!term) return

    setError('')
    setLoading(true)
    try {
      setWeather(await fetchWeather(term, API_KEY))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main class={`scene ${theme}`}>
      <div class="sky" aria-hidden="true"></div>

      <section class="panel">
        <a class="back" href="/">Back to comparisons</a>
        <h1 class="wordmark">WeatherNow</h1>

        <form onSubmit={search}>
          <input
            value={query}
            onInput={(e) => setQuery(e.target.value)}
            placeholder="city or zip"
            aria-label="City or zip code"
            autocomplete="off"
          />
          <button type="submit" disabled={loading}>
            {loading ? '...' : 'Search'}
          </button>
        </form>

        {weather?.demo && (
          <p class="demo-banner">Sample data: add an API key for live results.</p>
        )}

        {error && <p class="error">{error}</p>}

        {weather && !loading && (
          <div class="report" key={weather.dt}>
            <h2>
              {weather.name}, {weather.sys.country}
              {weather.demo && <span class="demo">demo data</span>}
            </h2>
            <p class="asof">As of {localTime}</p>
            <p class="temp">
              {Math.round(weather.main.temp)}
              <span class="deg">&deg;F</span>{' '}
              <em>/ {tempC}&deg;C</em>
            </p>
            <p class="desc">{weather.weather[0].description}</p>

            <dl>
              <div>
                <dt>Feels like</dt>
                <dd>{Math.round(weather.main.feels_like)}&deg;F</dd>
              </div>
              <div>
                <dt>Humidity</dt>
                <dd>{weather.main.humidity}%</dd>
              </div>
              <div>
                <dt>Wind</dt>
                <dd>
                  {Math.round(weather.wind.speed)} mph at {Math.round(weather.wind.deg)}&deg;
                </dd>
              </div>
              <div>
                <dt>Clouds</dt>
                <dd>{weather.clouds.all}%</dd>
              </div>
              <div>
                <dt>Visibility</dt>
                <dd>{toVisibility(weather)}</dd>
              </div>
              <div>
                <dt>Sunrise / Sunset</dt>
                <dd>{toSunTimes(weather)}</dd>
              </div>
            </dl>
          </div>
        )}
      </section>
    </main>
  )
}
