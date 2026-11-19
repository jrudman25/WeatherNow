import { LitElement, html, nothing, unsafeCSS } from 'lit'
import { themeFor, toCelsius, toLocalTime, fetchWeather } from '../../shared/weather.js'
import sharedCss from '../../shared/app.css?inline'

const API_KEY = import.meta.env.VITE_OWM_API_KEY

export class WeatherApp extends LitElement {
  static styles = [
    unsafeCSS(sharedCss),
    // shadow hosts are inline by default; the panel is display:grid-centered
    // so the host itself needs to be a block for min-height to matter
    // (raw CSS, no `css` helper needed for a plain string)
    unsafeCSS(':host { display: block; }'),
  ]

  static properties = {
    query: { state: true },
    weather: { state: true },
    loading: { state: true },
    error: { state: true },
  }

  constructor() {
    super()
    this.query = ''
    this.weather = null
    this.loading = false
    this.error = ''
  }

  get theme() {
    return themeFor(this.weather)
  }
  get tempC() {
    return this.weather ? toCelsius(this.weather) : 0
  }
  get localTime() {
    return this.weather ? toLocalTime(this.weather) : ''
  }

  async search(e) {
    e.preventDefault()
    const term = this.query.trim()
    if (!term) return

    this.error = ''
    this.loading = true
    try {
      this.weather = await fetchWeather(term, API_KEY)
    } catch (err) {
      this.error = err.message
    } finally {
      this.loading = false
    }
  }

  render() {
    return html`
      <main class="scene ${this.theme}">
        <div class="sky" aria-hidden="true"></div>

        <section class="panel">
          <a class="back" href="/">Back to comparisons</a>
          <h1 class="wordmark">WeatherNow</h1>

          <form @submit=${this.search}>
            <input
              .value=${this.query}
              @input=${(e) => (this.query = e.target.value)}
              placeholder="city or zip"
              aria-label="City or zip code"
              autocomplete="off"
            />
            <button type="submit" ?disabled=${this.loading}>
              ${this.loading ? '...' : 'Search'}
            </button>
          </form>

          ${this.weather?.demo
            ? html`<p class="demo-banner">Sample data: add an API key for live results.</p>`
            : nothing}
          ${this.error ? html`<p class="error">${this.error}</p>` : nothing}
          ${this.weather && !this.loading
            ? html`
                <div class="report">
                  <h2>
                    ${this.weather.name}, ${this.weather.sys.country}${this.weather.demo
                      ? html`<span class="demo">demo data</span>`
                      : nothing}
                  </h2>
                  <p class="temp">
                    ${Math.round(this.weather.main.temp)}<span class="deg">&deg;F</span>
                    <em>/ ${this.tempC}&deg;C</em>
                  </p>
                  <p class="desc">${this.weather.weather[0].description}</p>

                  <dl>
                    <div>
                      <dt>Clouds</dt>
                      <dd>${this.weather.clouds.all}%</dd>
                    </div>
                    <div>
                      <dt>Wind</dt>
                      <dd>
                        ${Math.round(this.weather.wind.speed)} mph at
                        ${Math.round(this.weather.wind.deg)}&deg;
                      </dd>
                    </div>
                    <div>
                      <dt>Humidity</dt>
                      <dd>${this.weather.main.humidity}%</dd>
                    </div>
                    <div>
                      <dt>As of</dt>
                      <dd>${this.localTime}</dd>
                    </div>
                  </dl>
                </div>
              `
            : nothing}
        </section>
      </main>
    `
  }
}

customElements.define('weather-app', WeatherApp)
