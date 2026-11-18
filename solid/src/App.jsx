import { createSignal, Show } from 'solid-js'
import { themeFor, toCelsius, toLocalTime, fetchWeather } from '../../shared/weather.js'

const API_KEY = import.meta.env.VITE_OWM_API_KEY

export function App() {
  const [query, setQuery] = createSignal('')
  const [weather, setWeather] = createSignal(null)
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal('')

  async function search(e) {
    e.preventDefault()
    const term = query().trim()
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
    <main class={`scene ${themeFor(weather())}`}>
      <div class="sky" aria-hidden="true" />

      <section class="panel">
        <h1 class="wordmark">WeatherNow</h1>

        <form onSubmit={search}>
          <input
            value={query()}
            onInput={(e) => setQuery(e.currentTarget.value)}
            placeholder="city or zip"
            aria-label="City or zip code"
            autocomplete="off"
          />
          <button type="submit" disabled={loading()}>
            {loading() ? '...' : 'Search'}
          </button>
        </form>

        <Show when={weather()?.demo}>
          <p class="demo-banner">Sample data: add an API key for live results.</p>
        </Show>

        <Show when={error()}>
          <p class="error">{error()}</p>
        </Show>

        <Show when={weather() && !loading()}>
          <div class="report">
            <h2>
              {weather().name}, {weather().sys.country}
              <Show when={weather().demo}>
                <span class="demo">demo data</span>
              </Show>
            </h2>
            <p class="temp">
              {Math.round(weather().main.temp)}
              <span class="deg">&deg;F</span>
              <em>/ {toCelsius(weather())}&deg;C</em>
            </p>
            <p class="desc">{weather().weather[0].description}</p>

            <dl>
              <div>
                <dt>Clouds</dt>
                <dd>{weather().clouds.all}%</dd>
              </div>
              <div>
                <dt>Wind</dt>
                <dd>
                  {Math.round(weather().wind.speed)} mph at {Math.round(weather().wind.deg)}&deg;
                </dd>
              </div>
              <div>
                <dt>Humidity</dt>
                <dd>{weather().main.humidity}%</dd>
              </div>
              <div>
                <dt>As of</dt>
                <dd>{toLocalTime(weather())}</dd>
              </div>
            </dl>
          </div>
        </Show>
      </section>
    </main>
  )
}
