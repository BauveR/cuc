import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { setMatchMedia } from '@/test/mocks/matchMedia'
import { ScrollTrigger, gsap } from '@/lib/gsap'
import { LENIS_OPTIONS, SmoothScrollProvider } from './SmoothScrollProvider'

const lenis = vi.hoisted(() => ({ raf: vi.fn(), on: vi.fn(), off: vi.fn() }))
const lenisProps = vi.hoisted(() => ({ current: null as null | Record<string, unknown> }))

vi.mock('lenis/react', async () => {
  const { createElement, Fragment } = await import('react')
  return {
    useLenis: () => lenis,
    ReactLenis: ({ children, ...props }: { children: unknown }) => {
      lenisProps.current = props
      return createElement(Fragment, null, children as never)
    },
  }
})

const renderProvider = () =>
  render(
    <SmoothScrollProvider>
      <p>contenido</p>
    </SmoothScrollProvider>,
  )

describe('<SmoothScrollProvider />', () => {
  beforeEach(() => {
    lenisProps.current = null
    lenis.on.mockReturnValue(lenis.off)
    vi.spyOn(gsap.ticker, 'add')
    vi.spyOn(gsap.ticker, 'remove')
    vi.spyOn(gsap.ticker, 'lagSmoothing')
  })
  afterEach(() => vi.clearAllMocks())

  it('renderiza los hijos y monta Lenis como root con reloj externo', () => {
    renderProvider()
    expect(screen.getByText('contenido')).toBeInTheDocument()
    expect(lenisProps.current).toMatchObject({ root: true, options: LENIS_OPTIONS })
    expect(LENIS_OPTIONS).toMatchObject({ autoRaf: false, syncTouch: false })
  })

  it('gsap.ticker mueve Lenis en ms y Lenis actualiza ScrollTrigger', () => {
    renderProvider()
    expect(lenis.on).toHaveBeenCalledWith('scroll', ScrollTrigger.update)
    expect(gsap.ticker.lagSmoothing).toHaveBeenCalledWith(0)

    const tick = vi.mocked(gsap.ticker.add).mock.calls[0]?.[0]
    tick?.(1.5, 0, 0, 0)
    expect(lenis.raf).toHaveBeenCalledWith(1500)
  })

  it('limpia ticker y listener al desmontar', () => {
    const { unmount } = renderProvider()
    unmount()
    expect(gsap.ticker.remove).toHaveBeenCalled()
    expect(lenis.off).toHaveBeenCalled()
  })

  it('con prefers-reduced-motion no monta Lenis', () => {
    setMatchMedia((q) => q.includes('reduce'))
    renderProvider()
    expect(screen.getByText('contenido')).toBeInTheDocument()
    expect(lenisProps.current).toBeNull()
    expect(gsap.ticker.add).not.toHaveBeenCalled()
  })

  it('desmonta Lenis si la preferencia cambia en caliente', () => {
    renderProvider()
    act(() => setMatchMedia((q) => q.includes('reduce')))
    expect(gsap.ticker.remove).toHaveBeenCalled()
  })
})
