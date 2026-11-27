const toRad = (deg: number): number => (deg * Math.PI) / 180

/**
 * Distancia a la que una cámara perspectiva encuadra una esfera de `radius`.
 * Usa el FOV más restrictivo (vertical u horizontal): en móvil vertical
 * manda el horizontal y el modelo no se corta por los lados.
 */
export const fitDistance = (radius: number, fovDeg: number, aspect: number): number => {
  const vFov = toRad(fovDeg)
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect)
  return radius / Math.sin(Math.min(vFov, hFov) / 2)
}
