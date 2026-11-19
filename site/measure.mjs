// Measures cold-load FCP, LCP, TBT, main-thread busy time, and submit-to-
// report render time for every impl staged in dist/ under throttled
// conditions, using the locally installed Chrome (no browser
// download). Writes perf.json, which is committed: build.mjs merges it into
// dist/stats.json so CI deploys keep the last measured numbers without a
// browser. Run after `npm run build` or `npm run stage`; also patches the
// current dist/stats.json so `npm run preview` shows the new numbers.
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright-core'
import sampleWeather from '../shared/sample-weather.js'

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

// TBT as Lighthouse defines it: per long task, the part after FCP beyond
// 50 ms. `busy` is the same measure without the FCP clamp: blocking over the
// whole load, which surfaces boot cost that FCP hides.
function collect() {
  const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null
  const { lcp, longTasks } = window.__perf
  let tbt = null
  let busy = null
  if (fcp !== null) {
    tbt = 0
    busy = 0
    for (const [start, duration] of longTasks) {
      if (duration > 50) busy += duration - 50
      const afterFcp = start + duration - Math.max(start, fcp)
      if (afterFcp > 50) tbt += afterFcp - 50
    }
  }
  return { fcp, lcp, tbt, busy }
}

// Drives a real search and times submit -> report visible -> painted. The
// capture-phase listener sets t0 before framework handlers run; the observer
// resolves on the mutation that reveals .report (covers the hidden attr,
// display:none, conditional mounts, and lit's shadow DOM), plus one painted
// frame. Resolves null on timeout so the missing-metric check reports it.
async function measureRender(page) {
  await page.evaluate(() => {
    window.__renderMs = Promise.race([
      new Promise((resolve) => {
        const arm = () => {
          const t0 = performance.now()
          const deepFind = (root) => {
            let el = root.querySelector('.report')
            if (el) return el
            for (const n of root.querySelectorAll('*'))
              if (n.shadowRoot && (el = deepFind(n.shadowRoot))) return el
            return null
          }
          const check = () => {
            const r = deepFind(document)
            if (r && r.getClientRects().length > 0) {
              obs.disconnect()
              requestAnimationFrame(() => requestAnimationFrame(() => resolve(performance.now() - t0)))
            }
          }
          const obs = new MutationObserver(check)
          const watch = (root) => {
            obs.observe(root, { childList: true, subtree: true, attributes: true })
            for (const n of root.querySelectorAll('*')) if (n.shadowRoot) watch(n.shadowRoot)
          }
          watch(document)
          check()
        }
        document.addEventListener('submit', arm, { capture: true, once: true })
        for (const n of document.querySelectorAll('*'))
          if (n.shadowRoot) n.shadowRoot.addEventListener('submit', arm, { capture: true, once: true })
      }),
      new Promise((resolve) => setTimeout(() => resolve(null), 15000)),
    ])
  })
  await page.fill('input[placeholder="city or zip"]', 'London')
  await page.click('button[type="submit"]')
  return page.evaluate(() => window.__renderMs)
}

async function measureOnce(browser, name) {
  // Fresh context per run = empty HTTP cache, so every load is cold
  const context = await browser.newContext({ viewport: VIEWPORT })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  // Stub the weather API so keyed and keyless builds take the same path
  await page.route('**://api.openweathermap.org/**', (route) => route.fulfill({ json: sampleWeather }))
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
  result.render = await measureRender(page)
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
    results[name] = Object.fromEntries(
      ['fcp', 'lcp', 'tbt', 'busy', 'render'].map((k) => [k, median(runs.map((r) => r[k]))])
    )
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
