/** Rango de device-pixel-ratio [mín, máx] que R3F puede usar. */
export type DprRange = readonly [number, number]

export interface GpuProfile {
  readonly tier: number
  readonly isMobile: boolean
}

/**
 * Calidad por tier de GPU (detect-gpu: 0 = sin WebGL útil … 3 = alta gama).
 * - tier 0 → null: solo póster, no se carga three.
 * - tier 1 → DPR 1 fijo.
 * - tier ≥ 2 → [1, 1.5] en móvil (batería, calor) y [1, 2] en escritorio.
 */
export const dprForGpu = ({ tier, isMobile }: GpuProfile): DprRange | null => {
  if (tier <= 0) return null
  if (tier === 1) return [1, 1]
  return isMobile ? [1, 1.5] : [1, 2]
}

/** Mínimo de rendimiento de R3F: AdaptiveDpr nunca baja de aquí. */
export const PERFORMANCE_MIN = 0.5
