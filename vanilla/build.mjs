// No bundler: dev serves the repo root so index.html can reach ../shared/.
// This script stages dist/ with the same sibling layout (dist/vanilla/ next to
// dist/shared/) so the ../shared/ references resolve identically once deployed.
import { cpSync, mkdirSync, rmSync } from 'node:fs'

rmSync('dist', { recursive: true, force: true })
mkdirSync('dist/vanilla', { recursive: true })

for (const f of ['index.html', 'app.js', 'config.js', 'favicon.ico']) {
  cpSync(f, `dist/vanilla/${f}`, { recursive: true })
}
cpSync('../shared', 'dist/shared', { recursive: true })
