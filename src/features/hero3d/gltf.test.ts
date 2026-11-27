import { describe, expect, it } from 'vitest'
import { BoxGeometry, Group, Mesh } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { clipTime, objectRadius } from './clip'
import { configureGltfLoader } from './configureGltfLoader'

/** Renderer falso: sin extensiones de compresión de texturas. */
const fakeRenderer = { extensions: { has: () => false, get: () => null } } as never

describe('configureGltfLoader', () => {
  // URL externa = cualquier http(s) que no sea nuestro origen (p. ej. gstatic/unpkg).
  const isExternal = (url: string) => /^https?:\/\//.test(url) && !url.startsWith(location.origin)

  it('usa los decoders empaquetados desde three (mismo origen) y Meshopt', () => {
    const loader = new GLTFLoader()
    configureGltfLoader(loader, fakeRenderer)
    const internals = loader as unknown as {
      dracoLoader: { decoderPaths: { js: string; wasm: string } }
      ktx2Loader: { transcoderPath: string }
      meshoptDecoder: unknown
    }
    const { js, wasm } = internals.dracoLoader.decoderPaths
    expect(wasm).toMatch(/draco\/gltf\/draco_decoder\.wasm$/) // variante glTF
    expect(js).toMatch(/draco\/gltf\/draco_wasm_wrapper\.js$/)
    expect(isExternal(js) || isExternal(wasm)).toBe(false)
    expect(internals.ktx2Loader.transcoderPath).toBe('') // '' = transcoder empaquetado
    expect(internals.meshoptDecoder).toBeTruthy()
  })
})

describe('clip', () => {
  it('convierte progreso en tiempo de clip, acotado', () => {
    expect(clipTime(0.5, 4)).toBe(2)
    expect(clipTime(-1, 4)).toBe(0)
    expect(clipTime(2, 4)).toBe(4)
  })

  it('calcula el radio envolvente de un objeto', () => {
    const mesh = new Mesh(new BoxGeometry(2, 2, 2))
    expect(objectRadius(mesh)).toBeCloseTo(Math.sqrt(3))
  })

  it('usa radio 1 para objetos vacíos (evita cámara en el infinito)', () => {
    expect(objectRadius(new Group())).toBe(1)
  })
})
