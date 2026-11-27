import { vi } from 'vitest'

type Resolver = (query: string) => boolean
type Listener = (event: MediaQueryListEvent) => void

let resolve: Resolver = () => false
const listeners = new Map<string, Set<Listener>>()

const notify = (): void => {
  for (const [media, set] of listeners) {
    const event = { matches: resolve(media), media } as MediaQueryListEvent
    for (const listener of set) listener(event)
  }
}

/**
 * Controla qué media queries "coinciden" y emite `change` a los suscriptores.
 * Ej.: setMatchMedia((q) => q.includes('prefers-reduced-motion'))
 * (Envolver en act() si hay componentes montados.)
 */
export const setMatchMedia = (resolver: Resolver): void => {
  resolve = resolver
  notify()
}

export const resetMatchMedia = (): void => {
  resolve = () => false
  listeners.clear()
}

const createList = (media: string): MediaQueryList => {
  const set = listeners.get(media) ?? new Set<Listener>()
  listeners.set(media, set)
  return {
    get matches() {
      return resolve(media)
    },
    media,
    onchange: null,
    addListener: vi.fn((l: Listener) => set.add(l)),
    removeListener: vi.fn((l: Listener) => set.delete(l)),
    addEventListener: vi.fn((_: string, l: Listener) => set.add(l)),
    removeEventListener: vi.fn((_: string, l: Listener) => set.delete(l)),
    dispatchEvent: vi.fn(() => false),
  } as MediaQueryList
}

export const installMatchMedia = (): void => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn(createList),
  })
}

/** Nº de suscriptores activos a una query (para verificar limpieza). */
export const listenerCount = (media: string): number => listeners.get(media)?.size ?? 0
