import { cx } from '@/lib/cx'
import { WORDMARK_HALF_PATHS, WORDMARK_REPEAT_DX, WORDMARK_VIEWBOX } from './wordmark.paths'

interface WordmarkProps {
  readonly className?: string
}

/**
 * Logotipo «CUC» en línea (sin petición extra, color = currentColor).
 * Decorativo: el nombre accesible lo da el enlace que lo contiene.
 */
export function Wordmark({ className }: WordmarkProps) {
  const half = WORDMARK_HALF_PATHS.map((d) => <path key={d} d={d} />)

  return (
    <svg
      viewBox={WORDMARK_VIEWBOX}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cx('block h-full w-auto', className)}
    >
      {half}
      <g transform={`translate(${WORDMARK_REPEAT_DX} 0)`}>{half}</g>
    </svg>
  )
}
