/** Tipos del contenido de layout (header, menú, idiomas, footer) y media. */
import type { Link } from './types.ts'

type Text = string

export interface LanguageOption {
  readonly code: 'es' | 'ca' | 'en'
  /** Etiqueta corta visible (ES, CA, EN). */
  readonly label: Text
  /** Nombre completo para lectores de pantalla. */
  readonly name: Text
  /** false = traducción pendiente: se muestra deshabilitado. */
  readonly available: boolean
}

export interface LayoutContent {
  readonly skipLink: Text
  /** Nombre accesible de la navegación principal. */
  readonly navLabel: Text
  readonly nav: readonly Link[]
  readonly menu: { readonly open: Text; readonly close: Text; readonly dialogLabel: Text }
  readonly languages: {
    readonly label: Text
    readonly unavailable: Text
    readonly options: readonly LanguageOption[]
  }
}

export interface FooterColumn {
  readonly title: Text
  readonly links: readonly Link[]
}

export interface FooterContent {
  readonly label: Text
  readonly columns: readonly FooterColumn[]
  readonly rights: Text
}

export type ImageId = 'workspace' | 'office' | 'barcelona' | 'network' | 'team'

/** Texto alternativo de cada imagen (descriptivo, en el idioma del sitio). */
export type MediaContent = Readonly<Record<ImageId, Text>>
