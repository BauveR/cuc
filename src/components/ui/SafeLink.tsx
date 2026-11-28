import type { MouseEventHandler, ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { isExternalHref, isSafeHref } from '@/lib/url'

export type LinkVariant = 'inline' | 'plain' | 'primary' | 'secondary' | 'inverse'

const BUTTON = 'inline-flex min-h-12 items-center justify-center rounded-full px-6 text-body font-medium transition-colors'

export const LINK_VARIANTS: Readonly<Record<LinkVariant, string>> = {
  inline: 'underline underline-offset-4 decoration-1 hover:decoration-2',
  /** Listas de navegación (menú, footer): subrayado solo en hover/foco. */
  plain: 'no-underline underline-offset-4 hover:underline focus-visible:underline',
  primary: `${BUTTON} bg-ink text-paper hover:bg-accent`,
  secondary: `${BUTTON} border border-ink text-ink hover:bg-ink hover:text-paper`,
  inverse: `${BUTTON} bg-paper text-ink hover:bg-surface`,
}

interface SafeLinkProps {
  readonly href: string
  readonly children: ReactNode
  readonly variant?: LinkVariant
  readonly className?: string
  readonly onClick?: MouseEventHandler<HTMLAnchorElement>
}

/**
 * Único componente de enlace de la app. Defensa en profundidad:
 * - href fuera de la allowlist (javascript:, data:, //host…) → no se
 *   renderiza como <a>, solo el texto.
 * - Externos: rel="noopener noreferrer" (sin acceso a window.opener ni Referer).
 */
export function SafeLink({ href, children, variant = 'inline', className, onClick }: SafeLinkProps) {
  const classes = cx(LINK_VARIANTS[variant], className)

  if (!isSafeHref(href)) {
    if (import.meta.env.DEV) console.warn('[SafeLink] href bloqueado:', href)
    return <span className={className}>{children}</span>
  }

  const external = isExternalHref(href)
  return (
    <a
      href={href.trim()}
      className={classes}
      {...(onClick && { onClick })}
      {...(external && { rel: 'noopener noreferrer' })}
    >
      {children}
    </a>
  )
}
