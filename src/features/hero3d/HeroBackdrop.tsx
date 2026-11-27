import { Suspense, lazy, useCallback, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { supportsWebGL } from '@/lib/webgl'
import { HeroPoster } from './HeroPoster'

// Chunk propio (ver manualChunks en vite.config.ts): three no entra en el bundle inicial.
const HeroCanvas = lazy(() => import('./HeroCanvas'))

/**
 * Fondo fijo del hero, detrás del contenido y a 100lvh (no salta al
 * mostrarse/ocultarse la barra del navegador móvil).
 * Sin 3D con reduced-motion o sin WebGL: solo póster.
 */
export function HeroBackdrop() {
  const reducedMotion = usePrefersReducedMotion()
  const [ready, setReady] = useState(false) // estado de UI, no de scroll
  const onReady = useCallback(() => setReady(true), [])
  const enable3d = !reducedMotion && supportsWebGL()

  return (
    <div
      aria-hidden="true"
      data-testid="hero-backdrop"
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden"
    >
      <HeroPoster faded={enable3d && ready} />
      {enable3d && (
        <Suspense fallback={null}>
          <HeroCanvas onReady={onReady} />
        </Suspense>
      )}
    </div>
  )
}
