import { useEffect, useState } from 'react'
import { ASSET_PATHS } from './assets'
import type { GpuProfile } from './quality'

/** undefined = detectando (se muestra el póster mientras tanto). */
export type GpuState = GpuProfile | undefined

/** Ante cualquier fallo de detección, la opción segura: sin 3D. */
const FALLBACK: GpuProfile = { tier: 0, isMobile: false }

/**
 * Detecta la GPU con detect-gpu (import dinámico: no pesa en el bundle
 * inicial). Benchmarks servidos desde nuestro origen: por defecto
 * detect-gpu los pediría a unpkg.com, bloqueado por la CSP.
 */
export const useGpuTier = (enabled: boolean): GpuState => {
  const [state, setState] = useState<GpuState>(undefined)

  useEffect(() => {
    if (!enabled) return
    let cancelled = false

    import('detect-gpu')
      .then(({ getGPUTier }) => getGPUTier({ benchmarksURL: ASSET_PATHS.gpuBenchmarks }))
      .then(({ tier, isMobile = false }) => ({ tier, isMobile }))
      .catch(() => FALLBACK)
      .then((profile) => {
        if (!cancelled) setState(profile)
      })

    return () => {
      cancelled = true
    }
  }, [enabled])

  return state
}
