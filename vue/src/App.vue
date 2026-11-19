<script setup>
import { ref, computed } from 'vue'
import {
  themeFor,
  toCelsius,
  toLocalTime,
  toSunTimes,
  toVisibility,
  fetchWeather,
} from '../../shared/weather.js'

const API_KEY = import.meta.env.VITE_OWM_API_KEY

const query = ref('')
const weather = ref(null)
const loading = ref(false)
const error = ref('')

const theme = computed(() => themeFor(weather.value))
const tempC = computed(() => (weather.value ? toCelsius(weather.value) : 0))
const localTime = computed(() => (weather.value ? toLocalTime(weather.value) : ''))
const sunTimes = computed(() => (weather.value ? toSunTimes(weather.value) : ''))
const visibility = computed(() => (weather.value ? toVisibility(weather.value) : ''))

async function search() {
  const term = query.value.trim()
  if (!term) return

  error.value = ''
  loading.value = true
  try {
    weather.value = await fetchWeather(term, API_KEY)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="scene" :class="theme">
    <div class="sky" aria-hidden="true"></div>

    <section class="panel">
      <a class="back" href="/">Back to comparisons</a>
      <h1 class="wordmark">WeatherNow</h1>

      <form @submit.prevent="search">
        <input
          v-model="query"
          placeholder="city or zip"
          aria-label="City or zip code"
          autocomplete="off"
        />
        <button type="submit" :disabled="loading">{{ loading ? '...' : 'Search' }}</button>
      </form>

      <Transition name="fade">
        <p v-if="weather?.demo" class="demo-banner">
          Sample data: add an API key for live results.
        </p>
      </Transition>

      <Transition name="fade">
        <p v-if="error" class="error">{{ error }}</p>
      </Transition>

      <Transition name="fly">
        <div v-if="weather && !loading" class="report">
          <h2>
            {{ weather.name }}, {{ weather.sys.country }}<span v-if="weather.demo" class="demo">demo data</span>
          </h2>
          <p class="asof">As of {{ localTime }}</p>
          <p class="temp">
            {{ Math.round(weather.main.temp) }}<span class="deg">&deg;F</span>
            <em>/ {{ tempC }}&deg;C</em>
          </p>
          <p class="desc">{{ weather.weather[0].description }}</p>

          <dl>
            <div>
              <dt>Feels like</dt>
              <dd>{{ Math.round(weather.main.feels_like) }}&deg;F</dd>
            </div>
            <div>
              <dt>Humidity</dt>
              <dd>{{ weather.main.humidity }}%</dd>
            </div>
            <div>
              <dt>Wind</dt>
              <dd>{{ Math.round(weather.wind.speed) }} mph at {{ Math.round(weather.wind.deg) }}&deg;</dd>
            </div>
            <div>
              <dt>Clouds</dt>
              <dd>{{ weather.clouds.all }}%</dd>
            </div>
            <div>
              <dt>Visibility</dt>
              <dd>{{ visibility }}</dd>
            </div>
            <div>
              <dt>Sunrise / Sunset</dt>
              <dd>{{ sunTimes }}</dd>
            </div>
          </dl>
        </div>
      </Transition>
    </section>
  </main>
</template>

<style scoped>
/* shared/app.css uses keyframe mount animations for frameworks without a
   transition system. Vue's <Transition> component handles enter/leave via
   named transition classes instead, so the shared keyframes are disabled
   locally. */
.error,
.report {
  animation: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fly-enter-active {
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.fly-enter-from {
  opacity: 0;
  transform: translateY(24px);
}
</style>
