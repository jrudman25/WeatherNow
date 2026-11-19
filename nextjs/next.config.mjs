/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'node:url';

const nextConfig = {
  // Static export — Firebase Hosting can't run a Node server
  output: 'export',
  // Deployed under site/dist/nextjs/ — generated URLs become /nextjs/_next/...
  basePath: '/nextjs',
  turbopack: {
    // Treat the repo root as the workspace so ../../shared/* imports resolve
    root: fileURLToPath(new URL('..', import.meta.url)),
  },
};

export default nextConfig;
