// Dependency-free static server for dist/ — `npm run preview` after build.
import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, join } from 'node:path'

const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.map': 'application/json',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
}

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  if (path.includes('..')) {
    res.writeHead(400)
    return res.end('bad request')
  }

  let file = join('dist', path)
  try {
    if ((await stat(file)).isDirectory()) {
      // Mirror Firebase Hosting: /svelte -> /svelte/ so relative asset URLs
      // resolve under the impl's subpath instead of the site root
      if (!path.endsWith('/')) {
        res.writeHead(301, { Location: path + '/' })
        return res.end()
      }
      file = join(file, 'index.html')
    }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' })
    createReadStream(file).pipe(res)
  } catch {
    res.writeHead(404)
    res.end('not found')
  }
}).listen(5180, () => console.log('http://localhost:5180'))
