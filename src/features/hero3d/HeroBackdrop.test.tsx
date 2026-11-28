import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'
import { resetWebGLCache } from '@/lib/webgl'
import { axe, renderWithProviders, screen, setMatchMedia } from '@/test/renderWithProviders'
import { HeroBackdrop } from './HeroBackdrop'
import type { GpuState } from './useGpuTier'

const ready = vi.hoisted(() => ({ fire: (): void => undefined }))
const gpu = vi.hoisted(() => ({ state: undefined as GpuState, enabledArg: undefined as unknown }))

vi.mock('./useGpuTier', () => ({
  useGpuTier: (enabled: boolean) => {
    gpu.enabledArg = enabled
    return gpu.state
  },
}))

vi.mock('@/features/heroVideo/HeroVideo', () => ({
  HeroVideo: () => <div data-testid="hero-video" />,
}))

vi.mock('./HeroCanvas', () => ({
  default: ({ onReady, dpr }: { onReady: () => void; dpr: readonly number[] }) => {
    ready.fire = onReady
    return <div data-testid="hero-canvas" data-dpr={dpr.join(',')} />
  },
}))

const withWebGL = (available: boolean) =>
  vi
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockImplementation((() => (available ? {} : null)) as never)

const poster = () => screen.getByRole('presentation', { hidden: true })

describe('<HeroBackdrop />', () => {
  beforeEach(() => {
    resetWebGLCache()
    gpu.state = { tier: 2, isMobile: false }
  })
  afterEach(() => resetWebGLCache())

  it('muestra el póster (LCP) y es decorativo', async () => {
    withWebGL(true)
    const { container } = renderWithProviders(<HeroBackdrop />)
    expect(screen.getByTestId('hero-backdrop')).toHaveAttribute('aria-hidden', 'true')
    expect(poster()).toHaveAttribute('fetchpriority', 'high')
    await screen.findByTestId('hero-canvas')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('carga el canvas con el DPR del tier y desvanece el póster al estar listo', async () => {
    withWebGL(true)
    gpu.state = { tier: 2, isMobile: true }
    renderWithProviders(<HeroBackdrop />)
    expect(await screen.findByTestId('hero-canvas')).toHaveAttribute('data-dpr', '1,1.5')
    expect(poster()).toHaveAttribute('data-faded', 'false')
    act(() => ready.fire())
    expect(poster()).toHaveAttribute('data-faded', 'true')
  })

  it.each([
    ['detectando GPU', undefined],
    ['GPU tier 0', { tier: 0, isMobile: false }],
  ])('solo póster mientras %s', (_, state) => {
    withWebGL(true)
    gpu.state = state
    renderWithProviders(<HeroBackdrop />)
    expect(screen.queryByTestId('hero-canvas')).not.toBeInTheDocument()
  })

  it('sin WebGL ni siquiera intenta detectar la GPU', () => {
    withWebGL(false)
    renderWithProviders(<HeroBackdrop />)
    expect(gpu.enabledArg).toBe(false)
    expect(screen.queryByTestId('hero-canvas')).not.toBeInTheDocument()
  })

  it('con prefers-reduced-motion no carga 3D', () => {
    withWebGL(true)
    setMatchMedia((q) => q.includes('reduce'))
    renderWithProviders(<HeroBackdrop />)
    expect(gpu.enabledArg).toBe(false)
    expect(screen.queryByTestId('hero-canvas')).not.toBeInTheDocument()
  })
})
