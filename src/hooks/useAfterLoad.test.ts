import { describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useAfterLoad } from './useAfterLoad'

describe('useAfterLoad', () => {
  it('se activa tras el load cuando el hilo queda libre', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useAfterLoad()) // jsdom: readyState "complete"
    expect(result.current).toBe(false)
    act(() => vi.advanceTimersByTime(2000))
    expect(result.current).toBe(true)
    vi.useRealTimers()
  })
})
