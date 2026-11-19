<script>
  import { fade, fly } from 'svelte/transition'
  import {
    themeFor,
    toCelsius,
    toLocalTime,
    toSunTimes,
    toVisibility,
    fetchWeather,
  } from '../../shared/weather.js'

  const API_KEY = import.meta.env.VITE_OWM_API_KEY

  let query = $state('')
  let weather = $state(null)
  let loading = $state(false)
  let error = $state('')

  let theme = $derived(themeFor(weather))
  let tempC = $derived(weather ? toCelsius(weather) : 0)
  let localTime = $derived(weather ? toLocalTime(weather) : '')
  let sunTimes = $derived(weather ? toSunTimes(weather) : '')
  let visibility = $derived(weather ? toVisibility(weather) : '')

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
    <a class="back" href="/">Back to comparisons</a>
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
      <p class="error" transition:fade={{ duration: 300 }}>{error}</p>
    {/if}

    {#if weather && !loading}
      <div class="report" in:fly={{ y: 24, duration: 600 }}>
        <h2>{weather.name}, {weather.sys.country}{#if weather.demo}<span class="demo">demo data</span>{/if}</h2>
        <p class="asof">As of {localTime}</p>
        <p class="temp">
          {Math.round(weather.main.temp)}<span class="deg">&deg;F</span>
          <em>/ {tempC}&deg;C</em>
        </p>
        <p class="desc">{weather.weather[0].description}</p>

        <dl>
          <div><dt>Feels like</dt><dd>{Math.round(weather.main.feels_like)}&deg;F</dd></div>
          <div><dt>Humidity</dt><dd>{weather.main.humidity}%</dd></div>
          <div>
            <dt>Wind</dt>
            <dd>{Math.round(weather.wind.speed)} mph at {Math.round(weather.wind.deg)}&deg;</dd>
          </div>
          <div><dt>Clouds</dt><dd>{weather.clouds.all}%</dd></div>
          <div><dt>Visibility</dt><dd>{visibility}</dd></div>
          <div><dt>Sunrise / Sunset</dt><dd>{sunTimes}</dd></div>
        </dl>
      </div>
    {/if}
  </section>
</main>

<style>
  /* shared/app.css uses keyframe mount animations for frameworks without a
     transition system. Svelte's fade/fly read the element's computed
     opacity as their target, so the running keyframe (opacity 0 on its
     first frame) made them animate 0 to 0 and then pop in. The shared
     keyframes are disabled locally so the directives own enter/leave. */
  .error,
  .report {
    animation: none;
  }
</style>
