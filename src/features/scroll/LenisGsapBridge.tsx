import { useEffect } from 'react'
import { useLenis } from 'lenis/react'
import { ScrollTrigger, gsap } from '@/lib/gsap'

// Valores por defecto de GSAP, para restaurarlos al desmontar.
const DEFAULT_LAG = { threshold: 500, adjustedLag: 33 } as const

/**
 * Reloj único: gsap.ticker mueve Lenis y cada scroll de Lenis actualiza
 * ScrollTrigger. GSAP da el tiempo en segundos y Lenis espera milisegundos.
 */
export function LenisGsapBridge() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return

    const offScroll = lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)

    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0) // sin saltos de tiempo tras pestañas inactivas

    return () => {
      offScroll()
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(DEFAULT_LAG.threshold, DEFAULT_LAG.adjustedLag)
    }
  }, [lenis])

  return null
}
