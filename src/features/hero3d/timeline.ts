import type { Keyframe, ModelController, Pose, Vec3 } from './types'

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n))
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t
const lerpVec = (a: Vec3, b: Vec3, t: number): Vec3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
]

/** Valida que los keyframes empiecen en 0, acaben en 1 y estén ordenados. */
export const assertTimeline = (keyframes: readonly Keyframe[]): void => {
  const ats = keyframes.map((k) => k.at)
  const sorted = ats.every((at, i) => i === 0 || at > (ats[i - 1] ?? 0))
  if (ats[0] !== 0 || ats.at(-1) !== 1 || !sorted) {
    throw new Error('Timeline inválida: `at` debe ir de 0 a 1 en orden creciente')
  }
}

/** Interpola linealmente la pose para un progreso (el suavizado va en useFrame). */
export const sampleTimeline = (keyframes: readonly Keyframe[], progress: number): Pose => {
  const p = clamp01(progress)
  const nextIndex = Math.max(1, keyframes.findIndex((k) => k.at >= p))
  const from = keyframes[nextIndex - 1]
  const to = keyframes[nextIndex]
  if (!from || !to) throw new Error('Timeline vacía')

  const t = (p - from.at) / (to.at - from.at)
  return {
    position: lerpVec(from.position, to.position, t),
    rotation: lerpVec(from.rotation, to.rotation, t),
    scale: lerp(from.scale, to.scale, t),
  }
}

/** Radio que envuelve el modelo en todas las poses (para encuadrar la cámara). */
export const boundingRadius = (keyframes: readonly Keyframe[], baseRadius: number): number =>
  Math.max(...keyframes.map((k) => Math.hypot(...k.position) + baseRadius * k.scale))

/** ModelController genérico basado en keyframes. */
export const createKeyframeController = (
  keyframes: readonly Keyframe[],
  baseRadius: number,
): ModelController => {
  assertTimeline(keyframes)
  return {
    radius: boundingRadius(keyframes, baseRadius),
    poseAt: (progress) => sampleTimeline(keyframes, progress),
  }
}
