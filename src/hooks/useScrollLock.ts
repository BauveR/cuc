import { useEffect } from 'react'
import { useLenis } from 'lenis/react'

/**
 * Bloquea el scroll de la página mientras `locked` (menú abierto):
 * - con Lenis activo: lenis.stop()/start() (si no, la rueda seguiría moviendo);
 * - siempre: overflow hidden en <html> (scroll nativo / reduced-motion).
 */
export const useScrollLock = (locked: boolean): void => {
  const lenis = useLenis()

  useEffect(() => {
    if (!locked) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    lenis?.stop()
    return () => {
      root.style.overflow = previous
      lenis?.start()
    }
  }, [locked, lenis])
}
