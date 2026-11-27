import type { ReactNode } from 'react'
import { ReactLenis } from 'lenis/react'
import type { LenisOptions } from 'lenis'
import 'lenis/dist/lenis.css'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { LenisGsapBridge } from './LenisGsapBridge'

export const LENIS_OPTIONS: LenisOptions = {
  autoRaf: false, // lo mueve gsap.ticker (LenisGsapBridge)
  syncTouch: false, // scroll nativo en táctil
  anchors: true, // los enlaces #ancla también se suavizan
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
