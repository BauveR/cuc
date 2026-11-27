import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

interface CardProps {
  readonly title: string
  readonly children?: ReactNode
  /** Etiqueta visible sobre el título (p. ej. "Caso ilustrativo"). */
  readonly badge?: string
  /** Texto pequeño sobre el título (categoría, sector…). */
  readonly kicker?: string
  readonly className?: string
}

/** Bloque de contenido con título h3. Filete superior, estilo editorial. */
export function Card({ title, children, badge, kicker, className }: CardProps) {
  return (
    <article className={cx('flex flex-col gap-4 border-t border-ink pt-6', className)}>
      {(badge || kicker) && (
        <div className="flex flex-wrap items-center gap-3 text-caption uppercase">
          {kicker && <p className="text-ink-muted">{kicker}</p>}
          {badge && <p className="rounded-full border border-ink px-3 py-1">{badge}</p>}
        </div>
      )}
      <h3 className="text-title font-semibold">{title}</h3>
      {children}
    </article>
  )
}
