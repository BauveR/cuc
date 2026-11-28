import { describe, expect, it } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { setMatchMedia } from '@/test/renderWithProviders'
import { prefersSaveData } from './prefersSaveData'
import { useMediaQuery } from './useMediaQuery'

describe('useMediaQuery', () => {
  it('refleja la media query y reacciona a cambios', () => {
    const { result } = renderHook(() => useMediaQuery('(max-aspect-ratio: 4/5)'))
    expect(result.current).toBe(false)
    act(() => setMatchMedia((q) => q === '(max-aspect-ratio: 4/5)'))
    expect(result.current).toBe(true)
  })
})

describe('prefersSaveData', () => {
  const withConnection = (connection: unknown) =>
    Object.defineProperty(navigator, 'connection', { value: connection, configurable: true })

  it('false sin Network Information API', () => {
    withConnection(undefined)
    expect(prefersSaveData()).toBe(false)
  })

  it('true con ahorro de datos o 2G; false en 4G', () => {
    withConnection({ saveData: true, effectiveType: '4g' })
    expect(prefersSaveData()).toBe(true)
    withConnection({ effectiveType: 'slow-2g' })
    expect(prefersSaveData()).toBe(true)
    withConnection({ effectiveType: '4g' })
    expect(prefersSaveData()).toBe(false)
  })
})
