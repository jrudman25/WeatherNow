// No bundler: dev serves the repo root so index.html can reach ../shared/.
// This script stages dist/ with the same sibling layout (dist/alpine/ next to
// dist/shared/) so the ../shared/ references resolve identically once deployed.
import { cpSync, mkdirSync, rmSync } from 'node:fs'

rmSync('dist', { recursive: true, force: true })
mkdirSync('dist/alpine', { recursive: true })

for (const f of ['index.html', 'app.js', 'alpine.css', 'config.js', 'favicon.ico', 'vendor']) {
  cpSync(f, `dist/alpine/${f}`, { recursive: true })
}
cpSync('../shared', 'dist/shared', { recursive: true })
