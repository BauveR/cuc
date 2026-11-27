import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { Plugin } from 'vite'
import { ASSET_PATHS } from '../src/features/hero3d/assets.ts'

const MODULES = resolve(import.meta.dirname, '../node_modules')
const BENCHMARKS = 'detect-gpu/dist/benchmarks'

const CONTENT_TYPES: Readonly<Record<string, string>> = {
  json: 'application/json',
}

const strip = (path: string): string => path.replace(/^\/|\/$/g, '')

/**
 * Allowlist explícita: URL pública → archivo en node_modules.
 * Solo se sirven estas entradas exactas (sin traversal posible).
 * (Los decoders Draco/Basis los empaqueta Vite desde three: ver assets.ts.)
 */
export const buildAssetMap = (modules = MODULES): ReadonlyMap<string, string> =>
  new Map(
    readdirSync(join(modules, BENCHMARKS))
      .filter((f) => f.endsWith('.json'))
      .map((f): [string, string] => [`${strip(ASSET_PATHS.gpuBenchmarks)}/${f}`, join(modules, BENCHMARKS, f)]),
  )

export const contentTypeFor = (file: string): string =>
  CONTENT_TYPES[file.split('.').pop() ?? ''] ?? 'application/octet-stream'

/** Resuelve una URL de petición contra la allowlist (ignora query/hash). */
export const resolveAsset = (map: ReadonlyMap<string, string>, url: string): string | undefined =>
  map.get(strip(url.split(/[?#]/)[0] ?? ''))

/** Sirve los assets en dev/preview y los emite en dist/ al compilar. */
export const selfHostedAssets = (): Plugin => {
  const map = buildAssetMap()
  return {
    name: 'self-hosted-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = req.url ? resolveAsset(map, req.url) : undefined
        if (!file) return next()
        res.setHeader('Content-Type', contentTypeFor(file))
        res.end(readFileSync(file))
      })
    },
    generateBundle() {
      for (const [fileName, file] of map) {
        this.emitFile({ type: 'asset', fileName, source: readFileSync(file) })
      }
    },
  }
}
