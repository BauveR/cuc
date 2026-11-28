import { afterEach, describe, expect, it, vi } from 'vitest'
import { setMatchMedia } from '@/test/renderWithProviders'
import { afterIntro, holdReveal, markIntroSeen, shouldPlayIntro } from './introGate'

describe('introGate', () => {
  afterEach(() => window.sessionStorage.clear())

  it('la intro se muestra una vez por sesión', () => {
    expect(shouldPlayIntro()).toBe(true)
    markIntroSeen()
    expect(shouldPlayIntro()).toBe(false)
  })

  it('nunca con prefers-reduced-motion', () => {
    setMatchMedia((q) => q.includes('reduce'))
    expect(shouldPlayIntro()).toBe(false)
  })

  it('sin almacenamiento disponible se muestra y no rompe', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    expect(shouldPlayIntro()).toBe(true)
    expect(() => markIntroSeen()).not.toThrow()
  })

  it('sin intro retenida, afterIntro ejecuta al momento', () => {
    const fn = vi.fn()
    afterIntro(fn)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('con la intro retenida, espera a que se libere', async () => {
    const release = holdReveal()
    const fn = vi.fn()
    afterIntro(fn)
    await Promise.resolve()
    expect(fn).not.toHaveBeenCalled()
    release()
    await vi.waitFor(() => expect(fn).toHaveBeenCalledTimes(1))
    afterIntro(fn) // liberada: vuelve a ser síncrono
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
