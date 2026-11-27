import { invalidate } from '@react-three/fiber'
import { ScrollTrigger, useGSAP } from '@/lib/gsap'
import { setScrollProgress } from './scrollState'

/**
 * Vuelca el progreso de scroll de la página en scrollState (fuera de React)
 * y pide un frame: con frameloop="demand" solo se renderiza si algo cambia.
 */
export const useScrollProgress = (): void => {
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: ({ progress }) => {
        setScrollProgress(progress)
        invalidate()
      },
    })
  })
}
