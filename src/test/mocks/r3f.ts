import { createElement, type ReactNode } from 'react'
import { vi } from 'vitest'

interface CanvasProps {
  readonly children?: ReactNode
  readonly className?: string
  readonly frameloop?: string
  readonly dpr?: unknown
}

/**
 * jsdom no implementa WebGL: <Canvas> se sustituye por un <div> inerte.
 * Los hijos (mallas, luces…) NO se renderizan: no son elementos DOM.
 * La escena 3D es decorativa, así que se marca aria-hidden.
 */
export const MockCanvas = ({ className, frameloop, dpr }: CanvasProps) =>
  createElement('div', {
    'data-testid': 'r3f-canvas',
    'aria-hidden': true,
    'data-frameloop': frameloop,
    'data-dpr': JSON.stringify(dpr),
    className,
  })

/**
 * Mock completo de '@react-three/fiber' (sin cargar three en jsdom).
 * Ampliar aquí si un componente usa otra API de R3F a nivel de módulo.
 */
export const r3fMock = {
  Canvas: MockCanvas,
  useFrame: () => undefined,
  useThree: () => ({ size: { width: 0, height: 0 }, viewport: { width: 0, height: 0 } }),
  extend: () => undefined,
  invalidate: vi.fn(),
}
