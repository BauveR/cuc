import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { usePageVisible } from '@/hooks/usePageVisible'
import { dprForGpu } from './quality'
import { useGpuTier } from './useGpuTier'

const getGPUTier = vi.hoisted(() => vi.fn())
vi.mock('detect-gpu', () => ({ getGPUTier }))

describe('dprForGpu', () => {
  it.each([
    [{ tier: 0, isMobile: false }, null],
    [{ tier: 1, isMobile: true }, [1, 1]],
    [{ tier: 2, isMobile: true }, [1, 1.5]],
    [{ tier: 2, isMobile: false }, [1, 2]],
    [{ tier: 3, isMobile: false }, [1, 2]],
  ])('%o → %o', (gpu, expected) => {
    expect(dprForGpu(gpu)).toEqual(expected)
  })
})

describe('useGpuTier', () => {
  it('pide los benchmarks a nuestro origen, nunca a un CDN', async () => {
    getGPUTier.mockResolvedValue({ tier: 2, isMobile: true })
    const { result } = renderHook(() => useGpuTier(true))
    expect(result.current).toBeUndefined()
    await waitFor(() => expect(result.current).toEqual({ tier: 2, isMobile: true }))
    expect(getGPUTier).toHaveBeenCalledWith({ benchmarksURL: '/gpu-benchmarks' })
  })

  it('si la detección falla, degrada a tier 0 (solo póster)', async () => {
    getGPUTier.mockRejectedValue(new Error('sin WebGL'))
    const { result } = renderHook(() => useGpuTier(true))
    await waitFor(() => expect(result.current).toEqual({ tier: 0, isMobile: false }))
  })

  it('no detecta nada si está deshabilitado', () => {
    const { result } = renderHook(() => useGpuTier(false))
    expect(result.current).toBeUndefined()
    expect(getGPUTier).not.toHaveBeenCalled()
  })
})

describe('usePageVisible', () => {
  const setVisibility = (state: DocumentVisibilityState) => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state })
    document.dispatchEvent(new Event('visibilitychange'))
  }
  afterEach(() => setVisibility('visible'))

  it('refleja la visibilidad de la pestaña en caliente', () => {
    const { result } = renderHook(() => usePageVisible())
    expect(result.current).toBe(true)
    act(() => setVisibility('hidden'))
    expect(result.current).toBe(false)
  })
})
