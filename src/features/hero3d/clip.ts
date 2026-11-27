import { Box3, Sphere, type Object3D } from 'three'

/** Tiempo del clip (s) para un progreso de scroll en [0, 1]. */
export const clipTime = (progress: number, duration: number): number =>
  Math.min(1, Math.max(0, progress)) * duration

/** Radio de la esfera que envuelve un objeto (para encuadrar la cámara). */
export const objectRadius = (object: Object3D): number => {
  const box = new Box3().setFromObject(object)
  return box.isEmpty() ? 1 : box.getBoundingSphere(new Sphere()).radius
}
