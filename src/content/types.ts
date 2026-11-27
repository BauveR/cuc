/**
 * Contrato de contenido. Cada idioma (es, ca, en) debe cumplirlo,
 * así TypeScript detecta traducciones incompletas en compilación.
 */
export const LOCALES = ['es'] as const // añadir 'ca' | 'en' cuando existan
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'es'

type Text = string
type List<T> = readonly T[]

export interface Link {
  readonly label: Text
  /** Solo rutas internas, anclas, mailto:, tel: o https:. Ver isSafeHref. */
  readonly href: string
}

export interface SectionHeading {
  readonly eyebrow: Text
  readonly title: Text
  readonly intro: Text
}

export interface MetaContent {
  readonly lang: string
  readonly title: Text
  readonly description: Text
}

export interface BrandContent {
  readonly name: Text
  readonly tagline: Text
  readonly location: Text
}

export interface HeroContent {
  readonly eyebrow: Text
  readonly title: Text
  readonly lead: Text
  readonly primaryCta: Link
  readonly secondaryCta: Link
}

export type ServiceId =
  | 'it-support'
  | 'cybersecurity'
  | 'cloud'
  | 'web-development'
  | 'integration-automation'
  | 'digital-consulting'

export interface ServiceItem {
  readonly id: ServiceId
  readonly title: Text
  readonly summary: Text
  readonly points: List<Text>
}

export interface ProcessStep {
  readonly title: Text
  readonly description: Text
}

export interface Sector {
  readonly id: string
  readonly name: Text
  readonly description: Text
}

export interface CaseStudy {
  readonly id: string
  readonly sector: Text
  readonly title: Text
  readonly challenge: Text
  readonly solution: Text
  readonly outcome: Text
  /** true = ejemplo ilustrativo, no un cliente real. Debe mostrarse como tal. */
  readonly illustrative: boolean
}

export interface ContactContent extends SectionHeading {
  readonly email: string
  readonly location: Text
  readonly hours: Text
  readonly cta: Link
}

export interface SiteContent {
  readonly meta: MetaContent
  readonly brand: BrandContent
  readonly hero: HeroContent
  readonly services: SectionHeading & { readonly items: List<ServiceItem> }
  readonly process: SectionHeading & { readonly steps: List<ProcessStep> }
  readonly sectors: SectionHeading & { readonly items: List<Sector> }
  readonly cases: SectionHeading & { readonly illustrativeLabel: Text; readonly items: List<CaseStudy> }
  readonly contact: ContactContent
}
