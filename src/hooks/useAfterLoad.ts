import { useEffect, useState } from 'react'

/**
 * true cuando la página ya cargó (evento load) y el hilo está libre:
 * para diferir medios no críticos y no competir con el LCP.
 */
export const useAfterLoad = (): boolean => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let idle = 0
    const schedule = () => {
      idle = window.requestIdleCallback
        ? window.requestIdleCallback(() => setReady(true), { timeout: 2000 })
        : window.setTimeout(() => setReady(true), 200)
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })
    return () => {
      window.removeEventListener('load', schedule)
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      window.clearTimeout(idle)
    }
  }, [])

  return ready
}
