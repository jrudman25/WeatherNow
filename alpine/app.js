import { themeFor, toCelsius, toLocalTime, fetchWeather } from '../shared/weather.js'

document.addEventListener('alpine:init', () => {
  Alpine.data('weatherApp', () => ({
    query: '',
    weather: null,
    loading: false,
    error: '',

    get theme() {
      return themeFor(this.weather)
    },
    get tempC() {
      return this.weather ? toCelsius(this.weather) : 0
    },
    get localTime() {
      return this.weather ? toLocalTime(this.weather) : ''
    },

    async search() {
      const term = this.query.trim()
      if (!term) return

      this.error = ''
      const apiKey = window.CONFIG?.API_KEY
      this.loading = true
      try {
        this.weather = await fetchWeather(term, apiKey)
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
  }))
})
