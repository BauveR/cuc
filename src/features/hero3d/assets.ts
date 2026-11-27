/**
 * Rutas públicas de assets 3D. Todo se sirve desde nuestro origen
 * (CSP 'self'): nada se descarga de un CDN externo.
 *
 * Los decoders Draco/Basis NO se listan aquí: three ≥ r18x los referencia con
 * `new URL(..., import.meta.url)` y Vite los empaqueta como assets con hash
 * (caché inmutable, versión siempre alineada con three).
 */
export const ASSET_PATHS = {
  /** Benchmarks de detect-gpu (por defecto los pediría a unpkg.com). */
  gpuBenchmarks: '/gpu-benchmarks',
} as const

/** Modelo del hero. null = aún no hay GLB de marca → PlaceholderModel. */
export const HERO_MODEL_URL: string | null = null
