import { useCallback, useState } from 'react'
import { SECTION_IDS, anchor, type SiteContent } from '@/content/site'
import { Hearts } from '@/components/brand/Hearts'
import { Monogram } from '@/components/brand/Monogram'
import { Wordmark } from '@/components/brand/Wordmark'
import { cx } from '@/lib/cx'
import { LangSwitch } from './LangSwitch'
import { MenuOverlay } from './MenuOverlay'
import { MenuToggle } from './MenuToggle'
import { NavLinks } from './NavLinks'

const MENU_ID = 'menu-principal'

interface HeaderProps {
  readonly content: Pick<SiteContent, 'brand' | 'layout' | 'meta'>
  /**
   * Cortinilla en curso: monograma y corazones ocultos (visibility) pero
   * ocupando su sitio, para que vuelen hasta ahí sin saltos de layout.
   */
  readonly introPending?: boolean
}

/**
 * Header sticky de 53 px sobre la rejilla de 12 columnas (como la referencia):
 * marca en las columnas 1–6; navegación e idiomas desde la 7 (≥ xl: por
 * debajo de 1280 px los 6 enlaces + idiomas no caben en 6 columnas).
 * En móvil/tablet, botón "Menú" que abre el overlay a pantalla completa.
 * Monograma a la izquierda del logotipo, alineado arriba y sobresaliendo por
 * debajo (sin capturar clics); corazones entre la nav y los idiomas (≥ xl).
 */
export function Header({ content, introPending = false }: HeaderProps) {
  const { brand, layout, meta } = content
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <header className="sticky top-0 z-40 h-header bg-paper px-gutter">
      {/* Menú abierto: barra inerte (sin foco) y oculta a lectores → un solo "Cerrar". */}
      <div className="grid h-full grid-cols-12 items-center gap-gutter" inert={open} aria-hidden={open}>
        {/* Logotipo 17:1: en móvil necesita 9 columnas; desde xl, 1–6 como la referencia. */}
        <a
          href={anchor(SECTION_IDS.intro)}
          aria-label={brand.name}
          className="col-span-9 flex h-3 w-fit items-start gap-1.5 min-[360px]:h-3.5 md:h-4 md:gap-2.5 xl:col-span-6"
        >
          <span
            data-intro-target="monogram"
            className={cx('pointer-events-none h-14 shrink-0 min-[360px]:h-18 md:h-24', introPending && 'invisible')}
          >
            <Monogram outlined className="h-full" />
          </span>
          <Wordmark />
        </a>
        <nav
          aria-label={layout.navLabel}
          className="col-span-6 hidden items-center justify-between font-semibold xl:flex"
        >
          {/* 1280–1365 px: separaciones algo menores para que quepan los corazones. */}
          <NavLinks links={layout.nav} className="gap-2.5 min-[1366px]:gap-4" />
          <span data-intro-target="hearts" className={cx('text-[6px]', introPending && 'invisible')}>
            <Hearts />
          </span>
          <LangSwitch languages={layout.languages} current={meta.lang} className="gap-2 min-[1366px]:gap-3" />
        </nav>
        <div data-intro-target="menu" className="col-span-3 flex justify-end xl:hidden">
          <MenuToggle open={open} onToggle={() => setOpen((o) => !o)} controls={MENU_ID} labels={layout.menu} />
        </div>
      </div>
      {open && (
        <MenuOverlay id={MENU_ID} layout={layout} brand={brand.name} lang={meta.lang} onClose={close} />
      )}
    </header>
  )
}
