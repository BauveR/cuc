import { useEffect, useState } from 'react'

/** Señales de que la persona está usando la página (no solo mirándola). */
export const INTERACTION_EVENTS = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'] as const

/**
 * true tras la primera interacción del usuario (una sola vez).
 * Permite diferir trabajo caro (three, shaders) fuera de la carga inicial:
 * mejora TBT/INP sin coste visual si lo diferido depende de esa interacción.
 */
export const useFirstInteraction = (enabled = true): boolean => {
  const [interacted, setInteracted] = useState(false)

  useEffect(() => {
    if (!enabled || interacted) return
    const controller = new AbortController()
    const onInteract = () => {
      setInteracted(true)
      controller.abort()
    }
    for (const type of INTERACTION_EVENTS) {
      window.addEventListener(type, onInteract, { passive: true, signal: controller.signal })
    }
    return () => controller.abort()
  }, [enabled, interacted])

  return interacted
}
