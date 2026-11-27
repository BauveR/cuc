import type { Timeline } from './types'

/** Ancho (px) por debajo del cual se usa la línea de tiempo móvil. */
export const MOBILE_BREAKPOINT = 768

/** Suavizado (λ de MathUtils.damp): mayor = sigue al scroll más rápido. */
export const DAMPING = 4

/** Control de frames compartido por todos los modelos animados. */
export const FRAME = {
  /** Por debajo de este error se considera alcanzado el objetivo (deja de pedir frames). */
  epsilon: 1e-4,
  /** Delta máximo: evita saltos tras pestañas inactivas o frames muy largos. */
  maxDelta: 1 / 15,
} as const

/** Radio base de la geometría placeholder (icosaedro). */
export const PLACEHOLDER_RADIUS = 1

/**
 * Keyframes por dispositivo. `at` = progreso de scroll de la página.
 * Móvil: el modelo se queda centrado en X y más pequeño (pantalla estrecha).
 */
export const TIMELINE: Timeline = {
  desktop: [
    // Inicio: modelo a la derecha, fuera de la columna del titular (contraste AA).
    { at: 0, position: [2.4, 0, 0], rotation: [0.3, 0, 0], scale: 0.9 },
    { at: 0.35, position: [-1.5, -0.2, 0], rotation: [0.8, 2.2, 0.2], scale: 0.8 },
    { at: 0.7, position: [1.2, 0.3, 0], rotation: [1.1, 3.6, 0.1], scale: 0.9 },
    { at: 1, position: [0, 0, 0], rotation: [1.4, 5, 0], scale: 1.15 },
  ],
  mobile: [
    { at: 0, position: [0, 0.7, 0], rotation: [0.3, 0, 0], scale: 0.75 },
    { at: 0.5, position: [0, -0.5, 0], rotation: [0.9, 2.6, 0.2], scale: 0.6 },
    { at: 1, position: [0, 0.2, 0], rotation: [1.4, 5, 0], scale: 0.85 },
  ],
}
