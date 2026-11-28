/**
 * Vuelo de los elementos de la cortinilla a su sitio en el header (FLIP con
 * dos copias: el destino ya existe, oculto, y reserva su espacio).
 */
export type IntroTarget = 'monogram' | 'hearts' | 'menu'

export interface Flight {
  readonly x: number
  readonly y: number
  readonly scale: number
}

type Box = Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>

/** Traslación de centro a centro y escala por alto (transform-origin: center). */
export const flightBetween = (from: Box, to: Box): Flight => ({
  x: to.left + to.width / 2 - (from.left + from.width / 2),
  y: to.top + to.height / 2 - (from.top + from.height / 2),
  scale: from.height > 0 ? to.height / from.height : 1,
})

export const flightTo = (el: Element, target: Element): Flight =>
  flightBetween(el.getBoundingClientRect(), target.getBoundingClientRect())

export const introTarget = (name: IntroTarget): HTMLElement | null =>
  document.querySelector<HTMLElement>(`[data-intro-target="${name}"]`)

/** Visible = renderizado (no display:none, p. ej. la nav por debajo de xl). */
export const isRendered = (el: Element | null): el is HTMLElement => !!el && el.getClientRects().length > 0

/**
 * Destino de cada corazón: su corazón en la nav (≥ xl) o, si la nav no se ve,
 * el botón Menú (entran en él y se desvanecen).
 */
export const heartDestinations = (): { readonly toMenu: boolean; readonly at: (i: number) => HTMLElement | null } => {
  const row = introTarget('hearts')
  if (isRendered(row)) {
    const hearts = row.querySelectorAll<HTMLElement>('[data-heart]')
    return { toMenu: false, at: (i) => hearts[i] ?? null }
  }
  const button = introTarget('menu')?.querySelector<HTMLElement>('button') ?? null
  return { toMenu: true, at: () => button }
}
