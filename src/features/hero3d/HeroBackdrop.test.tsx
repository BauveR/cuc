import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from '@testing-library/react'
import { resetWebGLCache } from '@/lib/webgl'
import { axe, renderWithProviders, screen, setMatchMedia } from '@/test/renderWithProviders'
import { HeroBackdrop } from './HeroBackdrop'

const ready = vi.hoisted(() => ({ fire: (): void => undefined }))

vi.mock('./HeroCanvas', () => ({
  default: ({ onReady }: { onReady: () => void }) => {
    ready.fire = onReady
    return <div data-testid="hero-canvas" />
  },
}))

const withWebGL = (available: boolean) =>
  vi
    .spyOn(HTMLCanvasElement.prototype, 'getContext')
    .mockImplementation((() => (available ? {} : null)) as never)

const poster = () => screen.getByRole('presentation', { hidden: true })

describe('<HeroBackdrop />', () => {
  beforeEach(() => resetWebGLCache())
  afterEach(() => resetWebGLCache())

  it('muestra el póster desde el inicio y es decorativo', async () => {
    withWebGL(true)
    const { container } = renderWithProviders(<HeroBackdrop />)
    expect(screen.getByTestId('hero-backdrop')).toHaveAttribute('aria-hidden', 'true')
    expect(poster()).toHaveAttribute('fetchpriority', 'high')
    expect(poster()).toHaveAttribute('data-faded', 'false')
    await screen.findByTestId('hero-canvas')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('carga el canvas en diferido y desvanece el póster al estar listo', async () => {
    withWebGL(true)
    renderWithProviders(<HeroBackdrop />)
    await screen.findByTestId('hero-canvas')
    act(() => ready.fire())
    expect(poster()).toHaveAttribute('data-faded', 'true')
  })

  it('sin WebGL solo muestra el póster', () => {
    withWebGL(false)
    renderWithProviders(<HeroBackdrop />)
    expect(screen.queryByTestId('hero-canvas')).not.toBeInTheDocument()
    expect(poster()).toHaveAttribute('data-faded', 'false')
  })

  it('con prefers-reduced-motion no carga 3D', () => {
    withWebGL(true)
    setMatchMedia((q) => q.includes('reduce'))
    renderWithProviders(<HeroBackdrop />)
    expect(screen.queryByTestId('hero-canvas')).not.toBeInTheDocument()
  })
})
