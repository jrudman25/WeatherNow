// Dependency-free static server. The app references ../shared/ resources, so
// this maps the URL space over two directories:
//   /shared/*  -> ../shared/*      (or dist/shared/* in preview mode)
//   /vanilla/* -> ./*              (or dist/vanilla/*)
//   /*         -> ./*              (or dist/vanilla/*) — app also reachable at /
import { createServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, join } from 'node:path'

const staged = process.argv[2] === 'dist'
const appDir = staged ? 'dist/vanilla' : '.'
const sharedDir = staged ? 'dist/shared' : '../shared'

const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.map': 'application/json',
}

createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  if (path.includes('..')) {
    res.writeHead(400)
    return res.end('bad request')
  }

  const file = path.startsWith('/shared/')
    ? join(sharedDir, path.slice('/shared'.length))
    : join(appDir, path.startsWith('/vanilla/') ? path.slice('/vanilla'.length) : path)

  try {
    let target = file
    if ((await stat(target)).isDirectory()) target = join(target, 'index.html')
    res.writeHead(200, { 'Content-Type': TYPES[extname(target)] ?? 'application/octet-stream' })
    createReadStream(target).pipe(res)
  } catch {
    res.writeHead(404)
    res.end('not found')
  }
}).listen(5179, () => console.log('http://localhost:5179'))
