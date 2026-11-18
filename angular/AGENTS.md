# AGENTS.md

## Stack

- Angular 22 + TypeScript 6, **standalone components** (no NgModule), signals,
  zoneless change detection (no `zone.js` dependency)
- `@angular/build` application builder (Vite/esbuild under the hood) driven by
  `angular.json`; `ng` CLI from `@angular/cli` is the runner — there is no
  `vite.config.js`
- Single-screen app: `src/app/app.ts` + `app.html` + `app.css`, bootstrapped in
  `src/main.ts`
- Framework-agnostic app code (OWM fetch, theme map, derived-value helpers,
  full stylesheet, sample payload) lives in `../shared/` — `src/styles.css`
  `@import`s `shared/app.css` as the global stylesheet; `weather.js` is
  imported directly (requires `allowJs` in tsconfig)
- Builds to `dist/browser/`; no per-implementation hosting config (`site/`
  owns the repo's single deploy)

## Commands

- `npm run dev` - `ng serve` (default port 4200)
- `npm run build` - `ng build` production build to `dist/browser/`
- `npm run preview` - `ng serve` production build on :4201 (in-memory, not
  from `dist/browser/`)

## Conventions

- Signals for state, `computed()` for derived values; `OnPush` +
  `provideZonelessChangeDetection` (no zone.js)
- New template control flow: `@if`, `@let` — not the old `*ngIf` structural
  directives
- Forms: `(ngSubmit)` auto-prevents default; `ngModel` needs explicit
  `[ngModel]`/`(ngModelChange)` split with signals — `[(ngModel)]` banana
  syntax would overwrite the signal object itself
- Transitions: `animate.enter="class"` bindings (Angular 20.2+ feature);
  `src/app/app.css` disables the shared keyframes and re-runs them via the
  enter classes
- Secrets use the `src/environments/` convention: gitignored
  `environment.ts`, documented `environment.example.ts`. Not `.env` —
  Angular has no `import.meta.env`
- Typed weather payload via `OwmWeather` interface in `app.ts`
- npm `min-release-age` is 7 days; pin new deps to versions published at least
  a week ago

## Notes

- `environment.ts` is listed in the repo-root `.gitignore`
- `@angular/compiler-cli` pins TypeScript to `>=6.0 <6.1` — TS 7 is out but
  not yet supported by Angular
