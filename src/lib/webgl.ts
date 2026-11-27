let cached: boolean | undefined

/** Detecta soporte WebGL una sola vez (crear contextos es caro). */
export const supportsWebGL = (): boolean => {
  if (cached !== undefined) return cached
  try {
    const canvas = document.createElement('canvas')
    cached = Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    cached = false
  }
  return cached
}

/** Solo para tests. */
export const resetWebGLCache = (): void => {
  cached = undefined
}
