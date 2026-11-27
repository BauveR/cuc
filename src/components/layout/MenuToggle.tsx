import type { Ref } from 'react'

interface MenuToggleProps {
  readonly open: boolean
  readonly onToggle: () => void
  /** id del panel que controla (aria-controls). */
  readonly controls: string
  readonly labels: { readonly open: string; readonly close: string }
  readonly ref?: Ref<HTMLButtonElement>
}

/** Botón de texto "Menú / Cerrar" con estado accesible (aria-expanded). */
export function MenuToggle({ open, onToggle, controls, labels, ref }: MenuToggleProps) {
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
      className="min-h-11 min-w-11 px-1 font-semibold hover:underline"
    >
      {open ? labels.close : labels.open}
    </button>
  )
}
