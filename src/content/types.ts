/**
 * Contrato de contenido. Cada idioma (es, ca, en) debe cumplirlo,
 * así TypeScript detecta traducciones incompletas en compilación.
 */
export const LOCALES = ['es'] as const // añadir 'ca' | 'en' cuando existan
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'es'

export interface MetaContent {
  readonly lang: string
  readonly title: string
  readonly description: string
}

export interface BrandContent {
  readonly name: string
  readonly tagline: string
  readonly location: string
}

export interface SiteContent {
  readonly meta: MetaContent
  readonly brand: BrandContent
}
