import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { buildAssetMap, contentTypeFor, resolveAsset } from './self-hosted-assets.ts'

const map = buildAssetMap()

describe('self-hosted assets', () => {
  it('sirve los benchmarks de detect-gpu (y solo JSON)', () => {
    const keys = [...map.keys()]
    expect(keys.length).toBeGreaterThan(0)
    expect(keys.every((k) => /^gpu-benchmarks\/[\w-]+\.json$/.test(k))).toBe(true)
  })

  it('todas las entradas existen en node_modules', () => {
    for (const file of map.values()) expect(existsSync(file), file).toBe(true)
  })

  it('resuelve URLs ignorando query y hash', () => {
    const [first] = map.keys()
    expect(resolveAsset(map, `/${first}?v=1#x`)).toBe(map.get(first ?? ''))
  })

  it.each([
    '/gpu-benchmarks/../../../package.json',
    '/gpu-benchmarks/%2e%2e/secret',
    '/gpu-benchmarks/',
    '/node_modules/three/package.json',
    '/.env',
  ])('rechaza lo que no está en la allowlist: %s', (url) => {
    expect(resolveAsset(map, url)).toBeUndefined()
  })

  it('asigna content-type correcto', () => {
    expect(contentTypeFor('a.json')).toBe('application/json')
    expect(contentTypeFor('a.bin')).toBe('application/octet-stream')
  })
})
