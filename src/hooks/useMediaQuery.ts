import { useCallback, useSyncExternalStore } from 'react'

/**
 * Estado de una media query, reactivo a cambios (rotar el móvil, redimensionar).
 * `serverValue`: valor sin window (SSR/prerender).
 */
export const useMediaQuery = (query: string, serverValue = false): boolean => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}
