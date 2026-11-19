import { defineConfig } from 'astro/config'

// Astro has no relative-base option; it wants a literal path prefix (same
// tradeoff as alpine/'s and vanilla/'s hardcoded <base href>).
export default defineConfig({
  base: '/astro',
})
