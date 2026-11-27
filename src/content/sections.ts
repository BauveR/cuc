/**
 * IDs de ancla estables (no se traducen): enlaces y analítica no se rompen
 * al cambiar de idioma.
 */
export const SECTION_IDS = {
  main: 'contenido',
  intro: 'inicio',
  services: 'servicios',
  integrations: 'integraciones',
  process: 'proceso',
  sectors: 'sectores',
  cases: 'casos',
  contact: 'contacto',
} as const

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS]

export const anchor = (id: SectionId): `#${SectionId}` => `#${id}`
