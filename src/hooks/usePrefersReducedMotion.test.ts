import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { listenerCount, setMatchMedia } from '@/test/mocks/matchMedia'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const QUERY = '(prefers-reduced-motion: reduce)'

describe('usePrefersReducedMotion', () => {
  it('devuelve false si el usuario no pide reducir movimiento', () => {
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(false)
  })

  it('devuelve true con prefers-reduced-motion: reduce', () => {
    setMatchMedia((q) => q === QUERY)
    const { result } = renderHook(() => usePrefersReducedMotion())
    expect(result.current).toBe(true)
  })

  it('reacciona en caliente al cambio de preferencia', () => {
    const { result } = renderHook(() => usePrefersReducedMotion())
    act(() => setMatchMedia((q) => q === QUERY))
    expect(result.current).toBe(true)
  })

  it('elimina su suscripción al desmontar', () => {
    const { unmount } = renderHook(() => usePrefersReducedMotion())
    expect(listenerCount(QUERY)).toBe(1)
    unmount()
    expect(listenerCount(QUERY)).toBe(0)
  })
})
