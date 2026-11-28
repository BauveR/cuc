import { useEffect, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const focusables = (root: HTMLElement): HTMLElement[] =>
  [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => !el.hasAttribute('inert'))

/**
 * Mientras `active`: lleva el foco al primer elemento del contenedor,
 * Tab/Shift+Tab ciclan dentro de él y Escape llama a `onEscape`.
 * Al desactivarse, devuelve el foco a donde estaba (p. ej. el botón Menú).
 */
export const useFocusTrap = (
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onEscape: () => void,
): void => {
  useEffect(() => {
    const root = ref.current
    if (!active || !root) return
    const previous = document.activeElement as HTMLElement | null
    focusables(root)[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') return onEscape()
      if (event.key !== 'Tab') return
      const items = focusables(root)
      const first = items[0]
      const last = items.at(-1)
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previous?.focus()
    }
  }, [ref, active, onEscape])
}
