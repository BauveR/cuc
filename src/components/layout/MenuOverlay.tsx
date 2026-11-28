import { useRef } from 'react'
import { Hearts } from '@/components/brand/Hearts'
import type { LayoutContent } from '@/content/site'
import { useAnchorNavigation } from '@/hooks/useAnchorNavigation'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useScrollLock } from '@/hooks/useScrollLock'
import { LangSwitch } from './LangSwitch'
import { MenuToggle } from './MenuToggle'
import { NavLinks } from './NavLinks'

interface MenuOverlayProps {
  readonly id: string
  readonly layout: LayoutContent
  readonly brand: string
  readonly lang: string
  readonly onClose: () => void
}

/**
 * Menú a pantalla completa (móvil/tablet). Diálogo modal accesible: foco
 * atrapado, Escape cierra, scroll de la página bloqueado (Lenis incluido).
 * Al elegir un enlace: cierra y luego navega (Lenis parado ignora scrollTo).
 */
export function MenuOverlay({ id, layout, brand, lang, onClose }: MenuOverlayProps) {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useAnchorNavigation()
  useFocusTrap(ref, true, onClose)
  useScrollLock(true)

  const onNavigate = (href: string) => {
    onClose()
    navigate(href)
  }

  return (
    <div
      ref={ref}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label={layout.menu.dialogLabel}
      className="fixed inset-0 z-50 flex flex-col bg-inverse px-gutter text-on-inverse"
    >
      <div className="flex h-header items-center justify-between">
        <span className="font-semibold">{brand}</span>
        <MenuToggle open onToggle={onClose} controls={id} labels={layout.menu} />
      </div>
      <nav aria-label={layout.navLabel} className="flex flex-1 flex-col justify-center">
        <NavLinks
          links={layout.nav}
          onNavigate={onNavigate}
          className="flex-col gap-2"
          linkClassName="text-headline font-semibold"
        />
      </nav>
      {/* Los corazones que "entraron" en el botón Menú durante la intro viven aquí. */}
      <div className="flex items-center justify-between py-gutter">
        <LangSwitch
          languages={layout.languages}
          current={lang}
          className="gap-3 [&_.text-ink-muted]:text-on-inverse-muted"
        />
        <Hearts className="text-[8px]" />
      </div>
    </div>
  )
}
