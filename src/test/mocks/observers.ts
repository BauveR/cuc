import { vi } from 'vitest'

/** IntersectionObserver mínimo: registra targets, no dispara callbacks. */
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin = '0px'
  readonly thresholds: readonly number[] = [0]
  readonly scrollMargin = '0px'
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = (): IntersectionObserverEntry[] => []
}

/** ResizeObserver mínimo (usado por R3F, drei y layouts responsive). */
class MockResizeObserver implements ResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

export const installObservers = (): void => {
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  vi.stubGlobal('ResizeObserver', MockResizeObserver)
}
