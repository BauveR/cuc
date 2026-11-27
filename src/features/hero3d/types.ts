export type Vec3 = readonly [number, number, number]

/** Transformación del modelo en un instante. */
export interface Pose {
  readonly position: Vec3
  readonly rotation: Vec3
  readonly scale: number
}

/** Pose fijada en un punto del progreso de scroll (`at` ∈ [0, 1]). */
export interface Keyframe extends Pose {
  readonly at: number
}

export interface Timeline {
  readonly mobile: readonly Keyframe[]
  readonly desktop: readonly Keyframe[]
}

/**
 * Contrato que cumple cualquier modelo del hero (placeholder hoy, GLTF mañana).
 * Abierto a extensión: un modelo nuevo implementa esta interfaz sin tocar la
 * escena, la cámara ni el scroll.
 */
export interface ModelController {
  /** Radio de la esfera que envuelve el modelo en todo su recorrido. */
  readonly radius: number
  /** Pose objetivo para un progreso de scroll en [0, 1]. */
  poseAt(progress: number): Pose
}
