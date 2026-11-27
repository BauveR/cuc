import { useSyncExternalStore } from 'react'

const subscribe = (onChange: () => void): (() => void) => {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

const getSnapshot = (): boolean => document.visibilityState === 'visible'

/** true mientras la pestaña está visible (Page Visibility API). */
export const usePageVisible = (): boolean => useSyncExternalStore(subscribe, getSnapshot, () => true)
