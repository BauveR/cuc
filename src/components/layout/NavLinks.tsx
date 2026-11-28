import type { MouseEvent } from 'react'
import type { Link } from '@/content/site'
import { SafeLink } from '@/components/ui/SafeLink'
import { cx } from '@/lib/cx'

interface NavLinksProps {
  readonly links: readonly Link[]
  readonly className?: string
  readonly linkClassName?: string
  /** Si se pasa, intercepta la navegación (p. ej. cerrar el menú antes). */
  readonly onNavigate?: (href: string) => void
}

/** Lista de enlaces de navegación. Compartida por header y menú (DRY). */
export function NavLinks({ links, className, linkClassName, onNavigate }: NavLinksProps) {
  const handleClick = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onNavigate?.(href)
  }

  return (
    <ul className={cx('flex', className)}>
      {links.map((link) => (
        <li key={link.href}>
          <SafeLink
            href={link.href}
            variant="plain"
            {...(linkClassName && { className: linkClassName })}
            {...(onNavigate && { onClick: handleClick(link.href) })}
          >
            {link.label}
          </SafeLink>
        </li>
      ))}
    </ul>
  )
}
