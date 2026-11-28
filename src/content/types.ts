/**
 * Contrato de contenido. Cada idioma (es, ca, en) debe cumplirlo,
 * así TypeScript detecta traducciones incompletas en compilación.
 */
import type {
  CaseLabels,
  CaseStudy,
  ContactContent,
  CtaContent,
  HeroContent,
  IntegrationGroup,
  ProcessStep,
  Sector,
  ServiceItem,
} from './section-types.ts'

export type * from './section-types.ts'
export type * from './layout-types.ts'
import type { FooterContent, LayoutContent, MediaContent } from './layout-types.ts'

export const LOCALES = ['es'] as const // añadir 'ca' | 'en' cuando existan
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'es'

export interface Link {
  readonly label: string
  /** Solo rutas internas, anclas, mailto:, tel: o https:. Ver isSafeHref. */
  readonly href: string
}

export interface SectionHeading {
  readonly eyebrow: string
  readonly title: string
  readonly intro: string
}

export interface MetaContent {
  readonly lang: string
  /** Locale Open Graph (p. ej. es_ES). */
  readonly locale: string
  readonly title: string
  readonly description: string
  /** Texto alternativo de la imagen Open Graph. */
  readonly ogImageAlt: string
}

export interface BrandContent {
  readonly name: string
  readonly tagline: string
  readonly location: string
}

type WithItems<T> = SectionHeading & { readonly items: readonly T[] }

export interface SiteContent {
  readonly meta: MetaContent
  readonly brand: BrandContent
  readonly hero: HeroContent
  readonly services: WithItems<ServiceItem>
  readonly integrations: WithItems<IntegrationGroup>
  readonly process: SectionHeading & { readonly steps: readonly ProcessStep[] }
  readonly sectors: WithItems<Sector>
  readonly cases: WithItems<CaseStudy> & { readonly labels: CaseLabels }
  readonly cta: CtaContent
  readonly contact: ContactContent
  readonly layout: LayoutContent
  readonly footer: FooterContent
  readonly media: MediaContent
}
