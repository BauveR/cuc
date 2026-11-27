import { afterEach, describe, expect, it, vi } from 'vitest'
import { resetWebGLCache, supportsWebGL } from './webgl'

const mockContext = (impl: () => unknown) =>
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(impl as never)

describe('supportsWebGL', () => {
  afterEach(() => resetWebGLCache())

  it('es false si el navegador no da contexto WebGL', () => {
    mockContext(() => null)
    expect(supportsWebGL()).toBe(false)
  })

  it('es true con contexto WebGL y cachea el resultado', () => {
    const spy = mockContext(() => ({}))
    expect(supportsWebGL()).toBe(true)
    supportsWebGL()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('es false si crear el contexto lanza un error', () => {
    mockContext(() => {
      throw new Error('GPU bloqueada')
    })
    expect(supportsWebGL()).toBe(false)
  })
})
