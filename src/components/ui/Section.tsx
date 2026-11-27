import type { ReactNode } from 'react'
import type { SectionId } from '@/content/site'
import { cx } from '@/lib/cx'

export type SectionTone = 'transparent' | 'paper' | 'surface' | 'inverse'

const TONES: Readonly<Record<SectionTone, string>> = {
  transparent: '',
  paper: 'bg-paper text-ink',
  surface: 'bg-surface text-ink',
  inverse: 'bg-inverse text-on-inverse',
}

interface SectionProps {
  readonly id: SectionId
  /** id del encabezado que nombra la sección (landmark accesible). */
  readonly labelledBy: string
  readonly children: ReactNode
  readonly tone?: SectionTone
  readonly className?: string
}

/**
 * Contenedor de sección: landmark <section> con nombre accesible, ancla
 * estable, data-section (para useSectionTriggers) y ritmo vertical común.
 */
export function Section({ id, labelledBy, children, tone = 'paper', className }: SectionProps) {
  return (
    <section
      id={id}
      data-section={id}
      data-tone={tone}
      aria-labelledby={labelledBy}
      className={cx('px-gutter py-section', TONES[tone], className)}
    >
      <div className="mx-auto flex w-full max-w-content flex-col gap-stack">{children}</div>
    </section>
  )
}
