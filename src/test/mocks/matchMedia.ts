import { vi } from 'vitest'

type Resolver = (query: string) => boolean

let resolve: Resolver = () => false

/**
 * Controla qué media queries "coinciden" en el test actual.
 * Ej.: setMatchMedia((q) => q.includes('prefers-reduced-motion'))
 */
export const setMatchMedia = (resolver: Resolver): void => {
  resolve = resolver
}

export const resetMatchMedia = (): void => {
  resolve = () => false
}

export const installMatchMedia = (): void => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string): MediaQueryList => ({
      matches: resolve(query),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    })),
  })
}
