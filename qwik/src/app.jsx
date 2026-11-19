import { component$, useSignal, $ } from '@builder.io/qwik'
import { themeFor, toCelsius, toLocalTime, fetchWeather } from '../../shared/weather.js'

const API_KEY = import.meta.env.VITE_OWM_API_KEY

export const App = component$(() => {
  const query = useSignal('')
  const weather = useSignal(null)
  const loading = useSignal(false)
  const error = useSignal('')

  const search = $(async () => {
    const term = query.value.trim()
    if (!term) return

    error.value = ''
    loading.value = true
    try {
      weather.value = await fetchWeather(term, API_KEY)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  })

  const theme = themeFor(weather.value)
  const tempC = weather.value ? toCelsius(weather.value) : 0
  const localTime = weather.value ? toLocalTime(weather.value) : ''

  return (
    <main class={`scene ${theme}`}>
      <div class="sky" aria-hidden="true"></div>

      <section class="panel">
        <a class="back" href="/">Back to comparisons</a>
        <h1 class="wordmark">WeatherNow</h1>

        <form preventdefault:submit onSubmit$={search}>
          <input
            bind:value={query}
            placeholder="city or zip"
            aria-label="City or zip code"
            autoComplete="off"
          />
          <button type="submit" disabled={loading.value}>
            {loading.value ? '...' : 'Search'}
          </button>
        </form>

        {weather.value?.demo && (
          <p class="demo-banner">Sample data: add an API key for live results.</p>
        )}

        {error.value && <p class="error">{error.value}</p>}

        {weather.value && !loading.value && (
          <div class="report" key={weather.value.dt}>
            <h2>
              {weather.value.name}, {weather.value.sys.country}
              {weather.value.demo && <span class="demo">demo data</span>}
            </h2>
            <p class="temp">
              {Math.round(weather.value.main.temp)}
              <span class="deg">&deg;F</span>
              <em>/ {tempC}&deg;C</em>
            </p>
            <p class="desc">{weather.value.weather[0].description}</p>

            <dl>
              <div>
                <dt>Clouds</dt>
                <dd>{weather.value.clouds.all}%</dd>
              </div>
              <div>
                <dt>Wind</dt>
                <dd>
                  {Math.round(weather.value.wind.speed)} mph at{' '}
                  {Math.round(weather.value.wind.deg)}&deg;
                </dd>
              </div>
              <div>
                <dt>Humidity</dt>
                <dd>{weather.value.main.humidity}%</dd>
              </div>
              <div>
                <dt>As of</dt>
                <dd>{localTime}</dd>
              </div>
            </dl>
          </div>
        )}
      </section>
    </main>
  )
})
