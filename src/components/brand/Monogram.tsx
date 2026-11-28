import type { Ref } from 'react'
import { cx } from '@/lib/cx'
import { MONOGRAM } from './marks.paths'

interface MonogramProps {
  readonly className?: string
  readonly ref?: Ref<SVGSVGElement>
}

/**
 * Monograma (48 × 98) tal cual el original (source/cuc-04.svg): mismo trazo,
 * relleno en currentColor. Decorativo. El alto lo fija `className`.
 */
export function Monogram({ className, ref }: MonogramProps) {
  return (
    <svg
      ref={ref}
      viewBox={MONOGRAM.viewBox}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cx('block w-auto', className)}
    >
      <path d={MONOGRAM.path} />
    </svg>
  )
}
