import { useEffect, useRef, type RefObject } from 'react'
import { ScrollTrigger, useGSAP } from '@/lib/gsap'

export const SECTION_SELECTOR = '[data-section]'

interface Options {
  /** Se invoca con el valor de data-section cuando la sección pasa a activa. */
  readonly onActive?: (id: string) => void
  readonly start?: string
  readonly end?: string
}

/**
 * Crea un ScrollTrigger por cada elemento [data-section] dentro de `scope`.
 * Marca data-active="true|false" (estilable por CSS) y notifica onActive.
 * Los triggers se destruyen al desmontar (contexto de useGSAP).
 */
export const useSectionTriggers = (
  scope: RefObject<HTMLElement | null>,
  { onActive, start = 'top center', end = 'bottom center' }: Options = {},
): void => {
  // Callback más reciente sin recrear los triggers en cada render.
  const onActiveRef = useRef(onActive)
  useEffect(() => {
    onActiveRef.current = onActive
  }, [onActive])

  useGSAP(
    () => {
      const sections = scope.current?.querySelectorAll<HTMLElement>(SECTION_SELECTOR) ?? []

      for (const el of sections) {
        ScrollTrigger.create({
          trigger: el,
          start,
          end,
          onToggle: ({ isActive }) => {
            el.dataset['active'] = String(isActive)
            const id = el.dataset['section']
            if (isActive && id) onActiveRef.current?.(id)
          },
        })
      }
    },
    { scope, dependencies: [start, end], revertOnUpdate: true },
  )
}
