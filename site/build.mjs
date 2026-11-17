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
import { extname, join, sep } from 'node:path'

const IMPLS = [
  { name: 'svelte', dir: '../svelte', dist: '../svelte/dist' },
  { name: 'preact', dir: '../preact', dist: '../preact/dist' },
  { name: 'vue', dir: '../vue', dist: '../vue/dist' },
  { name: 'lit', dir: '../lit', dist: '../lit/dist' },
  // alpine + vanilla stage their own dist as { <name>/, shared/ }; merge both halves
  { name: 'alpine', dir: '../alpine', dist: '../alpine/dist/alpine', shared: '../alpine/dist/shared' },
  { name: 'vanilla', dir: '../vanilla', dist: '../vanilla/dist/vanilla', shared: '../vanilla/dist/shared' },
  // angular emits to dist/browser
  { name: 'angular', dir: '../angular', dist: '../angular/dist/browser' },
]

const SOURCE_EXT = new Set(['.js', '.jsx', '.ts', '.svelte', '.vue', '.html', '.css', '.mjs'])
const SKIP_DIRS = new Set(['node_modules', 'dist', '.angular', 'vendor', 'public', 'environments', 'out-tsc'])

const skipBuilds = process.argv.includes('--skip-builds')

function* walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) yield* walk(p)
    else yield p
  }
}

function bundleStats(dir) {
  let jsBytes = 0,
    jsGzip = 0,
    cssBytes = 0,
    cssGzip = 0
  for (const f of walk(dir)) {
    const ext = extname(f)
    if (ext !== '.js' && ext !== '.css') continue
    const buf = readFileSync(f)
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
  for (const f of walk(dir)) {
    if ([...SKIP_DIRS].some((d) => f.split(sep).includes(d))) continue
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

  implementations[impl.name] = {
    ...bundleStats(join('dist', impl.name)),
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
