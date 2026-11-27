import { useCallback, useState } from 'react'
import { SECTION_IDS, anchor, type SiteContent } from '@/content/site'
import { LangSwitch } from './LangSwitch'
import { MenuOverlay } from './MenuOverlay'
import { MenuToggle } from './MenuToggle'
import { NavLinks } from './NavLinks'

const MENU_ID = 'menu-principal'

interface HeaderProps {
  readonly content: Pick<SiteContent, 'brand' | 'layout' | 'meta'>
}

/**
 * Header sticky de 53 px sobre la rejilla de 12 columnas (como la referencia):
 * marca en las columnas 1–6; navegación e idiomas desde la 7 (≥ lg).
 * En móvil/tablet, botón "Menú" que abre el overlay a pantalla completa.
 */
export function Header({ content }: HeaderProps) {
  const { brand, layout, meta } = content
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <header className="sticky top-0 z-40 h-header bg-paper px-gutter">
      {/* Menú abierto: barra inerte (sin foco) y oculta a lectores → un solo "Cerrar". */}
      <div className="grid h-full grid-cols-12 items-center gap-gutter" inert={open} aria-hidden={open}>
        <a href={anchor(SECTION_IDS.intro)} className="col-span-6 font-semibold">
          {brand.name}
        </a>
        <nav
          aria-label={layout.navLabel}
          className="col-span-6 hidden items-center justify-between font-semibold lg:flex"
        >
          <NavLinks links={layout.nav} className="gap-4" />
          <LangSwitch languages={layout.languages} current={meta.lang} />
        </nav>
        <div className="col-span-6 flex justify-end lg:hidden">
          <MenuToggle open={open} onToggle={() => setOpen((o) => !o)} controls={MENU_ID} labels={layout.menu} />
        </div>
      </div>
      {open && (
        <MenuOverlay id={MENU_ID} layout={layout} brand={brand.name} lang={meta.lang} onClose={close} />
      )}
    </header>
  )
}
