/**
 * IDs de ancla estables (no se traducen): enlaces y analítica no se rompen
 * al cambiar de idioma.
 */
export const SECTION_IDS = {
  main: 'contenido',
  services: 'servicios',
  process: 'proceso',
  sectors: 'sectores',
  cases: 'casos',
  contact: 'contacto',
} as const

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS]

export const anchor = (id: SectionId): `#${SectionId}` => `#${id}`
