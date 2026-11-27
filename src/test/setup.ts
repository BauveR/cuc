import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as axeMatchers from 'vitest-axe/matchers'
import { installMatchMedia, resetMatchMedia } from './mocks/matchMedia'
import { installObservers } from './mocks/observers'

expect.extend(axeMatchers)

// WebGL no existe en jsdom: Canvas de R3F mockeado globalmente.
// vi.mock se eleva sobre los imports: la factoría se carga de forma dinámica.
vi.mock('@react-three/fiber', async () => (await import('./mocks/r3f')).r3fMock)

// axe usa canvas para color-contrast; jsdom no lo implementa.
// Se silencia el aviso: el contraste se valida con tests de tokens.
HTMLCanvasElement.prototype.getContext = vi.fn(() => null)

beforeEach(() => {
  installMatchMedia()
  installObservers()
})

afterEach(() => {
  cleanup()
  resetMatchMedia()
  vi.unstubAllGlobals()
})
