import { useMediaQuery } from './useMediaQuery'

/**
 * true si el usuario pide reducir el movimiento. Reacciona en caliente.
 * Sin window (SSR/prerender) se asume movimiento reducido: la opción segura.
 */
export const usePrefersReducedMotion = (): boolean =>
  useMediaQuery('(prefers-reduced-motion: reduce)', true)
