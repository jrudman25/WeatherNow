<script>
  import { fade, fly } from 'svelte/transition'
  import { themeFor, toCelsius, toLocalTime, fetchWeather } from '../../shared/weather.js'

  const API_KEY = import.meta.env.VITE_OWM_API_KEY

  let query = $state('')
  let weather = $state(null)
  let loading = $state(false)
  let error = $state('')

  let theme = $derived(themeFor(weather))
  let tempC = $derived(weather ? toCelsius(weather) : 0)
  let localTime = $derived(weather ? toLocalTime(weather) : '')

  async function search() {
    const term = query.trim()
    if (!term) return

    error = ''
    loading = true
    try {
      weather = await fetchWeather(term, API_KEY)
    } catch (e) {
      error = e.message
    } finally {
      loading = false
    }
  }

  function onsubmit(e) {
    e.preventDefault()
    search()
  }
</script>

<main class="scene {theme}">
  <div class="sky" aria-hidden="true"></div>

  <section class="panel">
    <h1 class="wordmark">WeatherNow</h1>

    <form {onsubmit}>
      <input
        bind:value={query}
        placeholder="city or zip"
        aria-label="City or zip code"
        autocomplete="off"
      />
      <button type="submit" disabled={loading}>{loading ? '...' : 'Search'}</button>
    </form>

    {#if weather?.demo}
      <p class="demo-banner">Sample data: add an API key for live results.</p>
    {/if}

    {#if error}
      <p class="error" transition:fade>{error}</p>
    {/if}

    {#if weather && !loading}
      <div class="report" in:fly={{ y: 24, duration: 600 }}>
        <h2>{weather.name}, {weather.sys.country}{#if weather.demo}<span class="demo">demo data</span>{/if}</h2>
        <p class="temp">
          {Math.round(weather.main.temp)}<span class="deg">&deg;F</span>
          <em>/ {tempC}&deg;C</em>
        </p>
        <p class="desc">{weather.weather[0].description}</p>

        <dl>
          <div><dt>Clouds</dt><dd>{weather.clouds.all}%</dd></div>
          <div>
            <dt>Wind</dt>
            <dd>{Math.round(weather.wind.speed)} mph at {Math.round(weather.wind.deg)}&deg;</dd>
          </div>
          <div><dt>Humidity</dt><dd>{weather.main.humidity}%</dd></div>
          <div><dt>As of</dt><dd>{localTime}</dd></div>
        </dl>
      </div>
    {/if}
  </section>
</main>
