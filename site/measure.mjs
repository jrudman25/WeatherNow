// Measures cold-load FCP, LCP, and TBT for every impl staged in dist/ under
// throttled conditions, using the locally installed Chrome (no browser
// download). Writes perf.json, which is committed: build.mjs merges it into
// dist/stats.json so CI deploys keep the last measured numbers without a
// browser. Run after `npm run build` or `npm run stage`; also patches the
// current dist/stats.json so `npm run preview` shows the new numbers.
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright-core'

const RUNS = 5
const PORT = 5181
// Lighthouse's mobile preset with DevTools throttling: Slow 4G + 4x CPU
const PROFILE = { latencyMs: 562.5, downloadKbps: 1474.56, uploadKbps: 675, cpuSlowdown: 4 }
const VIEWPORT = { width: 412, height: 823 }
// Long tasks are collected until load, FCP, and network idle, plus this window
const SETTLE_MS = 2000

const stats = JSON.parse(readFileSync('dist/stats.json', 'utf8'))
const names = Object.keys(stats.implementations)

function startServer() {
  const child = spawn(process.execPath, ['server.mjs'], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: ['ignore', 'pipe', 'inherit'],
  })
  return new Promise((resolve, reject) => {
    child.stdout.once('data', () => resolve(child))
    child.once('exit', (code) => reject(new Error(`server.mjs exited with code ${code}`)))
  })
}

// Runs in the page before any app script so buffered entries are not missed
function observe() {
  window.__perf = { lcp: null, longTasks: [] }
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__perf.lcp = e.startTime
  }).observe({ type: 'largest-contentful-paint', buffered: true })
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) window.__perf.longTasks.push([e.startTime, e.duration])
  }).observe({ type: 'longtask', buffered: true })
}

// TBT as Lighthouse defines it: per long task, the part after FCP beyond 50 ms
function collect() {
  const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null
  const { lcp, longTasks } = window.__perf
  let tbt = null
  if (fcp !== null) {
    tbt = 0
    for (const [start, duration] of longTasks) {
      const afterFcp = start + duration - Math.max(start, fcp)
      if (afterFcp > 50) tbt += afterFcp - 50
    }
  }
  return { fcp, lcp, tbt }
}

async function measureOnce(browser, name) {
  // Fresh context per run = empty HTTP cache, so every load is cold
  const context = await browser.newContext({ viewport: VIEWPORT })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  const cdp = await context.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: PROFILE.latencyMs,
    downloadThroughput: (PROFILE.downloadKbps * 1024) / 8,
    uploadThroughput: (PROFILE.uploadKbps * 1024) / 8,
  })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: PROFILE.cpuSlowdown })
  await page.addInitScript(observe)
  await page.goto(`http://localhost:${PORT}/${name}/`)
  // Under CPU throttling goto can resolve before the load event and before
  // FCP (seen with ember), so wait for both explicitly
  await page.waitForFunction(
    () => document.readyState === 'complete' && performance.getEntriesByName('first-contentful-paint').length > 0,
    null,
    { timeout: 60000 }
  )
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(SETTLE_MS)
  const result = await page.evaluate(collect)
  await context.close()
  if (errors.length) throw new Error(`${name}: page errors: ${errors.join('; ')}`)
  for (const [k, v] of Object.entries(result)) if (v === null) throw new Error(`${name}: no ${k} recorded`)
  return result
}

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b)
  const m = s.length >> 1
  return Math.round(s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2)
}

const server = await startServer()
const browser = await chromium.launch({ channel: 'chrome' })
try {
  const samples = Object.fromEntries(names.map((n) => [n, []]))
  // Interleave impls per round so machine-load drift spreads across all of them
  for (let run = 1; run <= RUNS; run++) {
    for (const name of names) samples[name].push(await measureOnce(browser, name))
    console.log(`round ${run}/${RUNS} done`)
  }

  const results = {}
  for (const [name, runs] of Object.entries(samples)) {
    results[name] = Object.fromEntries(['fcp', 'lcp', 'tbt'].map((k) => [k, median(runs.map((r) => r[k]))]))
  }
  const perf = {
    measured: new Date().toISOString(),
    chrome: browser.version(),
    runs: RUNS,
    profile: PROFILE,
    viewport: VIEWPORT,
    results,
  }
  writeFileSync('perf.json', JSON.stringify(perf, null, 2) + '\n')
  writeFileSync('dist/stats.json', JSON.stringify({ ...stats, perf }, null, 2))
  console.table(results)
} finally {
  await browser.close()
  server.kill()
}
