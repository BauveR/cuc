/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { securityHeaders } from './config/security-headers.ts'
import { htmlMeta } from './config/html-meta-plugin.ts'
import { selfHostedAssets } from './config/self-hosted-assets.ts'
import { seoPlugin } from './config/seo-plugin.ts'
import { resolveSiteUrl } from './config/site-url.ts'
import { getContent } from './src/content/site.ts'

/**
 * three/R3F en un chunk propio y diferido. React va aparte de forma explícita:
 * si no, Rolldown lo arrastraría a vendor-three (dependencia de R3F) y el
 * chunk principal importaría three estáticamente, rompiendo el lazy-load.
 */
const vendorChunk = (id: string): string | undefined => {
  if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react'
  if (/node_modules\/(three|@react-three|three-stdlib|maath)\//.test(id)) return 'vendor-three'
  return undefined
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    htmlMeta(getContent().meta),
    selfHostedAssets(),
    seoPlugin({
      content: getContent(),
      // URL pública (no es secreto). Se define en el hosting o en .env.local.
      site: resolveSiteUrl(loadEnv(mode, process.cwd(), 'VITE_')['VITE_SITE_URL']),
      buildDate: new Date().toISOString().slice(0, 10),
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Solo VITE_* se expone al cliente. Nunca poner secretos con este prefijo.
  envPrefix: 'VITE_',
  build: {
    sourcemap: false, // no publicar el código fuente en producción
    // three es lazy (~250 kB gzip) y nunca bloquea el primer render.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: { manualChunks: vendorChunk },
    },
  },
  server: {
    headers: securityHeaders({ dev: true }),
  },
  preview: {
    headers: securityHeaders({ dev: false }),
  },
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['src/**/*.test.{ts,tsx}', 'config/**/*.test.ts'],
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    restoreMocks: true,
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}', 'config/**/*.ts'],
      exclude: ['**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx', '**/*.d.ts', 'src/content/types.ts'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
}))
