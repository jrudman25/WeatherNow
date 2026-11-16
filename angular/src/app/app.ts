import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { environment } from '../environments/environment'
import { themeFor, toCelsius, toLocalTime, fetchWeather } from '../../../shared/weather.js'

interface OwmWeather {
  name: string
  sys: { country: string }
  main: { temp: number; humidity: number }
  weather: { main: string; description: string }[]
  wind: { speed: number; deg: number }
  clouds: { all: number }
  dt: number
  timezone: number
  demo?: boolean
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly round = Math.round
  protected readonly query = signal('')
  protected readonly weather = signal<OwmWeather | null>(null)
  protected readonly loading = signal(false)
  protected readonly error = signal('')

  protected readonly theme = computed(() => themeFor(this.weather()))
  protected readonly tempC = computed(() => {
    const w = this.weather()
    return w ? toCelsius(w) : 0
  })
  protected readonly localTime = computed(() => {
    const w = this.weather()
    return w ? toLocalTime(w) : ''
  })

  protected async search() {
    const term = this.query().trim()
    if (!term) return

    this.error.set('')
    this.loading.set(true)
    try {
      this.weather.set(await fetchWeather(term, environment.owmApiKey))
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : String(e))
    } finally {
      this.loading.set(false)
    }
  }
}
