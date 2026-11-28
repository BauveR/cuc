import { Suspense, lazy, useCallback, useState } from 'react'
import { HeroVideo } from '@/features/heroVideo/HeroVideo'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { supportsWebGL } from '@/lib/webgl'
import { HeroPoster } from './HeroPoster'
import { dprForGpu } from './quality'
import { useGpuTier } from './useGpuTier'

// Chunk propio (ver manualChunks en vite.config.ts): three no entra en el bundle inicial.
const HeroCanvas = lazy(() => import('./HeroCanvas'))

/**
 * Fondo fijo del hero, detrás del contenido y a 100lvh.
 * Capas (de atrás adelante): póster → vídeo con scrub → canvas 3D.
 * Solo póster si: reduced-motion, sin WebGL, detectando GPU o GPU tier 0.
 */
export function HeroBackdrop() {
  const reducedMotion = usePrefersReducedMotion()
  const canTry3d = !reducedMotion && supportsWebGL()
  const gpu = useGpuTier(canTry3d)
  const dpr = canTry3d && gpu ? dprForGpu(gpu) : null
  const [ready, setReady] = useState(false) // estado de UI, no de scroll
  const onReady = useCallback(() => setReady(true), [])

  return (
    <div
      aria-hidden="true"
      data-testid="hero-backdrop"
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden"
    >
      <HeroPoster faded={dpr !== null && ready} />
      <HeroVideo />
      {dpr && (
        <Suspense fallback={null}>
          <HeroCanvas onReady={onReady} dpr={dpr} />
        </Suspense>
      )}
    </div>
  )
}
