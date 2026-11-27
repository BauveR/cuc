import type { ReactNode } from 'react'
import { ReactLenis } from 'lenis/react'
import type { LenisOptions } from 'lenis'
import 'lenis/dist/lenis.css'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { LenisGsapBridge } from './LenisGsapBridge'

/** Alto del header sticky (= token --spacing-header, 53 px). */
export const HEADER_OFFSET_PX = 53

export const LENIS_OPTIONS: LenisOptions = {
  autoRaf: false, // lo mueve gsap.ticker (LenisGsapBridge)
  syncTouch: false, // scroll nativo en táctil
  // Los enlaces #ancla también se suavizan, sin quedar bajo el header sticky.
  anchors: { offset: -HEADER_OFFSET_PX },
}

interface SmoothScrollProviderProps {
  readonly children: ReactNode
}

/**
 * Smooth scroll con Lenis sincronizado con GSAP.
 * Con prefers-reduced-motion se desactiva: scroll 100 % nativo.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) return <>{children}</>

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <LenisGsapBridge />
      {children}
    </ReactLenis>
  )
}
