// Builds every implementation, stages each dist/ under site/dist/<name>/,
// and emits dist/stats.json (bundle sizes, LOC, dep count, build time).
// `node build.mjs --skip-builds` re-stages from existing dist/ output without
// rebuilding — useful when iterating on the landing page.
import { execSync } from 'node:child_process'
import {
  cpSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { gzipSync } from 'node:zlib'
import { extname, join } from 'node:path'

const IMPLS = [
  { name: 'svelte', dir: '../svelte', dist: '../svelte/dist' },
  { name: 'react', dir: '../react', dist: '../react/dist' },
  { name: 'solid', dir: '../solid', dist: '../solid/dist' },
  { name: 'preact', dir: '../preact', dist: '../preact/dist' },
  { name: 'vue', dir: '../vue', dist: '../vue/dist' },
  { name: 'lit', dir: '../lit', dist: '../lit/dist' },
  { name: 'qwik', dir: '../qwik', dist: '../qwik/dist' },
  { name: 'astro', dir: '../astro', dist: '../astro/dist' },
  { name: 'ember', dir: '../ember', dist: '../ember/dist' },
  { name: 'nextjs', dir: '../nextjs', dist: '../nextjs/out' },
  // alpine + vanilla stage their own dist as { <name>/, shared/ }; merge both halves
  { name: 'alpine', dir: '../alpine', dist: '../alpine/dist/alpine', shared: '../alpine/dist/shared' },
  { name: 'vanilla', dir: '../vanilla', dist: '../vanilla/dist/vanilla', shared: '../vanilla/dist/shared' },
  // angular emits to dist/browser
  { name: 'angular', dir: '../angular', dist: '../angular/dist/browser' },
]

const SOURCE_EXT = new Set(['.js', '.jsx', '.ts', '.svelte', '.vue', '.gjs', '.astro', '.html', '.css', '.mjs'])
const SKIP_DIRS = new Set(['node_modules', 'dist', '.angular', '.astro', '.next', 'out', 'tmp', 'vendor', 'public', 'environments', 'out-tsc'])

const skipBuilds = process.argv.includes('--skip-builds')

// `skip` prunes directories by name before descending (LOC only; staged dist
// dirs may legitimately contain e.g. alpine's vendor/)
function* walk(dir, skip = new Set()) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) {
      if (!skip.has(e.name)) yield* walk(p, skip)
    } else yield p
  }
}

function bundleStats(dir) {
  let jsBytes = 0,
    jsGzip = 0,
    cssBytes = 0,
    cssGzip = 0
  for (const f of walk(dir)) {
    const ext = extname(f)
    const buf = readFileSync(f)
    if (ext === '.html') {
      // Inline <script>/<style> payloads are shipped JS/CSS too (astro
      // inlines its whole bundle; other impls emit external files only)
      const html = buf.toString('utf8')
      for (const m of html.matchAll(/<script(?![^>]*\ssrc)[^>]*>([\s\S]*?)<\/script>/g)) {
        jsBytes += m[1].length
        jsGzip += gzipSync(m[1]).length
      }
      for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
        cssBytes += m[1].length
        cssGzip += gzipSync(m[1]).length
      }
      continue
    }
    if (ext !== '.js' && ext !== '.css') continue
    const gz = gzipSync(buf).length
    if (ext === '.js') {
      jsBytes += buf.length
      jsGzip += gz
    } else {
      cssBytes += buf.length
      cssGzip += gz
    }
  }
  return { jsBytes, jsGzip, cssBytes, cssGzip }
}

function countLoc(dir) {
  let n = 0
  for (const f of walk(dir, SKIP_DIRS)) {
    if (!SOURCE_EXT.has(extname(f))) continue
    n += readFileSync(f, 'utf8').split('\n').length
  }
  return n
}

function depCount(dir) {
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
  return Object.keys(pkg.dependencies ?? {}).length + Object.keys(pkg.devDependencies ?? {}).length
}

rmSync('dist', { recursive: true, force: true })
mkdirSync('dist', { recursive: true })

const implementations = {}
for (const impl of IMPLS) {
  const t0 = performance.now()
  if (!skipBuilds) execSync('npm run build', { cwd: impl.dir, stdio: 'inherit' })
  const buildMs = skipBuilds ? null : Math.round(performance.now() - t0)

  cpSync(impl.dist, join('dist', impl.name), { recursive: true })
  if (impl.shared) cpSync(impl.shared, 'dist/shared', { recursive: true })

  const bundle = bundleStats(join('dist', impl.name))
  // alpine/vanilla load ../shared/ at runtime instead of bundling it, so its
  // JS/CSS counts toward their size the same way it does for bundled impls
  if (impl.shared) for (const [k, v] of Object.entries(bundleStats(impl.shared))) bundle[k] += v

  implementations[impl.name] = {
    ...bundle,
    loc: countLoc(impl.dir),
    deps: depCount(impl.dir),
    buildMs,
  }
}

writeFileSync(
  'dist/stats.json',
  JSON.stringify({ generated: new Date().toISOString(), implementations }, null, 2)
)
for (const f of ['index.html', 'site.css']) cpSync(f, join('dist', f))
cpSync('../svelte/public/favicon.ico', 'dist/favicon.ico')

console.log('\nsite/dist staged:', Object.keys(implementations).join(', '))
