/** Tipos de contenido por sección de la home. Ver contrato en types.ts. */
import type { Link, SectionHeading } from './types.ts'

type Text = string
type List<T> = readonly T[]

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

export interface IntegrationGroup {
  readonly id: string
  readonly category: Text
  /** Herramientas habituales del mercado. No implica partnership oficial. */
  readonly tools: List<Text>
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

export interface CaseLabels {
  readonly illustrative: Text
  readonly challenge: Text
  readonly solution: Text
  readonly outcome: Text
}

export interface CtaContent extends SectionHeading {
  readonly action: Link
}

export interface ContactContent extends SectionHeading {
  readonly email: string
  readonly location: Text
  readonly hours: Text
  readonly cta: Link
}
