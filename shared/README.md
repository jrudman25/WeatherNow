# shared/

Framework-agnostic code used by every WeatherNow implementation. Importing this
keeps the comparison honest: each implementation only expresses the framework's
component model, reactivity, and templating — the app logic lives here.

## weather.js

| Export | Purpose |
|---|---|
| `THEMES` | Maps OpenWeatherMap `weather.main` groups to `.scene.*` CSS classes |
| `fetchWeather(term, apiKey)` | Calls the OWM current-weather endpoint (imperial units); 5-digit terms use `zip=`, others use `q=`; throws on non-OK responses. When `apiKey` is falsy, returns `sample-weather.js` (with `demo: true` added so UIs can badge it) so keyless setups still render |
| `themeFor(weather)` | Resolves the theme class for a weather payload (`'default'` when unset/unknown) |
| `toCelsius(weather)` | Converts the imperial `main.temp` to a rounded Celsius integer |
| `toLocalTime(weather)` | Formats `dt` + `timezone` as `HH:MM local` |
| `toSunTimes(weather)` | Formats `sys.sunrise`/`sys.sunset` + `timezone` as `HH:MM / HH:MM` |
| `toVisibility(weather)` | Formats `visibility` (meters) as miles (`n/a` when OWM omits it) |

## app.css

The full stylesheet: global reset plus all `.panel`/`.report`/theme styles.
Implementations import it once at their entry point, e.g.
`import '../../shared/app.css'`. The themed sky cross-fade relies on
`@property`-registered `--c1`/`--c2` stops on `.scene`.

## sample-weather.js

A canned OpenWeatherMap response (San Francisco, clear), exported as a plain
ES module so every environment can import it — including build-free native
ESM, where JSON module imports aren't reliably supported. `fetchWeather()`
returns it automatically when called without an API key, which makes fresh
clones demoable; it can also serve as a test fixture.
