/**
 * Parámetros visuales de la escena. Colores alineados con los tokens
 * (src/styles/tokens.css): ink #141414, accent #8a3a1c, paper #f3f0ea.
 */
export const SCENE = {
  camera: { fov: 35, near: 0.1, far: 100 },
  dpr: [1, 2] as [number, number],
  lights: {
    ambient: 0.7,
    key: { intensity: 1.6, position: [3, 4, 5] as [number, number, number] },
    rim: { intensity: 0.8, position: [-4, -2, -3] as [number, number, number], color: '#8a3a1c' },
  },
  material: { color: '#141414', roughness: 0.45, metalness: 0.1 },
} as const

/** Póster estático: LCP y fallback (reduced-motion, sin WebGL). */
export const POSTER = {
  avif: '/hero/poster.avif',
  webp: '/hero/poster.webp',
  width: 1920,
  height: 1200,
} as const
