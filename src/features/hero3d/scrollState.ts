/**
 * Estado mutable FUERA de React. El progreso de scroll cambia a 60 fps:
 * guardarlo en useState re-renderizaría el árbol en cada frame.
 * Lo escribe ScrollTrigger y lo lee useFrame. Prohibido usar useState aquí.
 */
export const scrollState = {
  progress: 0,
}

export const setScrollProgress = (progress: number): void => {
  scrollState.progress = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0
}
