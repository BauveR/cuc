/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { securityHeaders } from './config/security-headers.ts'
import { htmlMeta } from './config/html-meta-plugin.ts'
import { getContent } from './src/content/index.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), htmlMeta(getContent().meta)],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Solo VITE_* se expone al cliente. Nunca poner secretos con este prefijo.
  envPrefix: 'VITE_',
  build: {
    sourcemap: false, // no publicar el código fuente en producción
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
  },
})
