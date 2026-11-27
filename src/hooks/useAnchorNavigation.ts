import { useCallback } from 'react'
import { useLenis } from 'lenis/react'
import { HEADER_OFFSET_PX } from '@/features/scroll/SmoothScrollProvider'

/**
 * Navega a un ancla (#id) de forma accesible: scroll (suave con Lenis,
 * nativo sin él) y foco en el destino para lectores de pantalla y teclado.
 * Se usa tras cerrar el menú: Lenis ignora scrollTo mientras está parado.
 */
export const useAnchorNavigation = (): ((href: string) => void) => {
  const lenis = useLenis()

  return useCallback(
    (href: string) => {
      const target = href.startsWith('#') ? document.getElementById(href.slice(1)) : null
      if (!target) return
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      requestAnimationFrame(() => {
        if (lenis) lenis.scrollTo(target, { offset: -HEADER_OFFSET_PX })
        else target.scrollIntoView({ block: 'start' })
        target.focus({ preventScroll: true })
      })
    },
    [lenis],
  )
}
