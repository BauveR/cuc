import type { Ref } from 'react'
import { cx } from '@/lib/cx'
import { MONOGRAM } from './marks.paths'

interface MonogramProps {
  readonly className?: string
  /**
   * Contorno fino color papel por fuera del trazo (paint-order: stroke):
   * invisible sobre papel, recorta el monograma sobre fondos oscuros.
   */
  readonly outlined?: boolean
  readonly ref?: Ref<SVGSVGElement>
}

/** Monograma (48 × 98), decorativo y en currentColor. El alto lo fija `className`. */
export function Monogram({ className, outlined = false, ref }: MonogramProps) {
  return (
    <svg
      ref={ref}
      viewBox={MONOGRAM.viewBox}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      overflow="visible"
      className={cx('block w-auto', className)}
    >
      <path
        d={MONOGRAM.path}
        {...(outlined && { stroke: 'var(--color-paper)', strokeWidth: 3, paintOrder: 'stroke' })}
      />
    </svg>
  )
}
