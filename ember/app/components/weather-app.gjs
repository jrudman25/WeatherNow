import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { on } from '@ember/modifier';
import {
  themeFor,
  toCelsius,
  toLocalTime,
  toSunTimes,
  toVisibility,
  fetchWeather,
} from '../../../shared/weather.js';

const API_KEY = import.meta.env.VITE_OWM_API_KEY;

export default class WeatherApp extends Component {
  @tracked query = '';
  @tracked weather = null;
  @tracked loading = false;
  @tracked error = '';

  get theme() {
    return themeFor(this.weather);
  }

  get tempC() {
    return this.weather ? toCelsius(this.weather) : 0;
  }

  get localTime() {
    return this.weather ? toLocalTime(this.weather) : '';
  }

  get temp() {
    return this.weather ? Math.round(this.weather.main.temp) : 0;
  }

  get feelsLike() {
    return this.weather ? Math.round(this.weather.main.feels_like) : 0;
  }

  get sunTimes() {
    return this.weather ? toSunTimes(this.weather) : '';
  }

  get visibility() {
    return this.weather ? toVisibility(this.weather) : '';
  }

  get wind() {
    return this.weather
      ? `${Math.round(this.weather.wind.speed)} mph at ${Math.round(this.weather.wind.deg)}°`
      : '';
  }

  @action
  updateQuery(event) {
    this.query = event.target.value;
  }

  @action
  async search(event) {
    event.preventDefault();
    const term = this.query.trim();
    if (!term) return;

    this.error = '';
    this.loading = true;
    try {
      this.weather = await fetchWeather(term, API_KEY);
    } catch (err) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

  <template>
    <main class="scene {{this.theme}}">
      <div class="sky" aria-hidden="true"></div>

      <section class="panel">
        <a class="back" href="/">Back to comparisons</a>
        <h1 class="wordmark">WeatherNow</h1>

        <form {{on "submit" this.search}}>
          <input
            value={{this.query}}
            {{on "input" this.updateQuery}}
            placeholder="city or zip"
            aria-label="City or zip code"
            autocomplete="off"
          />
          <button type="submit" disabled={{this.loading}}>
            {{if this.loading "..." "Search"}}
          </button>
        </form>

        {{#if this.weather.demo}}
          <p class="demo-banner">Sample data: add an API key for live results.</p>
        {{/if}}

        {{#if this.error}}
          <p class="error">{{this.error}}</p>
        {{/if}}

        {{#if this.weather}}
          {{#unless this.loading}}
            <div class="report">
              <h2>
                {{this.weather.name}},
                {{this.weather.sys.country}}
                {{#if this.weather.demo}}<span class="demo">demo data</span>{{/if}}
              </h2>
              <p class="asof">As of {{this.localTime}}</p>
              <p class="temp">
                {{this.temp}}<span class="deg">&deg;F</span>
                <em>/ {{this.tempC}}&deg;C</em>
              </p>
              <p class="desc">{{this.weather.weather.[0].description}}</p>

              <dl>
                <div>
                  <dt>Feels like</dt>
                  <dd>{{this.feelsLike}}&deg;F</dd>
                </div>
                <div>
                  <dt>Humidity</dt>
                  <dd>{{this.weather.main.humidity}}%</dd>
                </div>
                <div>
                  <dt>Wind</dt>
                  <dd>{{this.wind}}</dd>
                </div>
                <div>
                  <dt>Clouds</dt>
                  <dd>{{this.weather.clouds.all}}%</dd>
                </div>
                <div>
                  <dt>Visibility</dt>
                  <dd>{{this.visibility}}</dd>
                </div>
                <div>
                  <dt>Sunrise / Sunset</dt>
                  <dd>{{this.sunTimes}}</dd>
                </div>
              </dl>
            </div>
          {{/unless}}
        {{/if}}
      </section>
    </main>
  </template>
}
