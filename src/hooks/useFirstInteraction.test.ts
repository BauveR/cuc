import { describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { INTERACTION_EVENTS, useFirstInteraction } from './useFirstInteraction'

describe('useFirstInteraction', () => {
  it.each(INTERACTION_EVENTS)('se activa con "%s"', (type) => {
    const { result } = renderHook(() => useFirstInteraction())
    expect(result.current).toBe(false)
    act(() => {
      window.dispatchEvent(new Event(type))
    })
    expect(result.current).toBe(true)
  })

  it('deja de escuchar tras la primera interacción', () => {
    const remove = vi.spyOn(AbortController.prototype, 'abort')
    renderHook(() => useFirstInteraction())
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(remove).toHaveBeenCalled()
  })

  it('no escucha nada si está deshabilitado', () => {
    const add = vi.spyOn(window, 'addEventListener')
    const { result } = renderHook(() => useFirstInteraction(false))
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    expect(result.current).toBe(false)
    expect(add).not.toHaveBeenCalledWith('scroll', expect.anything(), expect.anything())
  })
})
