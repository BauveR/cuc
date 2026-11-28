import type { Ref } from 'react'
import { cx } from '@/lib/cx'
import { HEART, HEART_COUNT } from './marks.paths'

// Clase literal (Tailwind la detecta en el código): separación del original en em.
const GAP = 'gap-[0.26em]'
void HEART.gapEm // fuente del valor: 5,8 / 22,4

interface HeartsProps {
  readonly className?: string
  readonly ref?: Ref<HTMLUListElement>
}

/**
 * Fila de 10 corazones de píxel, decorativa. Alto de cada corazón = 1em:
 * el tamaño lo fija el font-size del contenedor (p. ej. text-[6px]).
 * Cada corazón es un <li data-heart> para animarlo por separado.
 */
export function Hearts({ className, ref }: HeartsProps) {
  return (
    <ul ref={ref} aria-hidden="true" className={cx('flex', GAP, className)}>
      {Array.from({ length: HEART_COUNT }, (_, i) => (
        <li key={i} className="h-[1em]" data-heart="">
          <svg viewBox={HEART.viewBox} fill="currentColor" focusable="false" className="block h-full w-auto">
            <path d={HEART.path} />
          </svg>
        </li>
      ))}
    </ul>
  )
}
