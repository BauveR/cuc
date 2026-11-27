import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { invalidate } from '@react-three/fiber'
import { act, render, screen } from '@testing-library/react'
import { ScrollTrigger } from '@/lib/gsap'
import HeroCanvas from './HeroCanvas'
import { scrollState } from './scrollState'

type Config = Parameters<typeof ScrollTrigger.create>[0]
const lastConfig = (): Config | undefined => vi.mocked(ScrollTrigger.create).mock.calls.at(-1)?.[0]
const renderCanvas = () => render(<HeroCanvas onReady={vi.fn()} dpr={[1, 1.5]} />)
const canvas = () => screen.getByTestId('r3f-canvas')

const setVisibility = (state: DocumentVisibilityState) => {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state })
  document.dispatchEvent(new Event('visibilitychange'))
}

describe('<HeroCanvas />', () => {
  beforeEach(() => {
    vi.spyOn(ScrollTrigger, 'create')
  })
  afterEach(() => setVisibility('visible'))

  it('es decorativo y usa el rango de DPR del tier de GPU', () => {
    renderCanvas()
    expect(canvas()).toHaveAttribute('aria-hidden', 'true')
    expect(canvas()).toHaveAttribute('data-dpr', '[1,1.5]')
  })

  it('renderiza bajo demanda y se pausa con la pestaña oculta', () => {
    renderCanvas()
    expect(canvas()).toHaveAttribute('data-frameloop', 'demand')
    act(() => setVisibility('hidden'))
    expect(canvas()).toHaveAttribute('data-frameloop', 'never')
    vi.mocked(invalidate).mockClear()
    act(() => setVisibility('visible'))
    expect(invalidate).toHaveBeenCalled() // repinta al volver
  })

  it('sigue el progreso de toda la página fuera de React', () => {
    renderCanvas()
    expect(lastConfig()).toMatchObject({ trigger: document.documentElement, start: 'top top' })
    lastConfig()?.onUpdate?.({ progress: 0.42 } as ScrollTrigger)
    expect(scrollState.progress).toBe(0.42)
    expect(invalidate).toHaveBeenCalled()
  })

  it('destruye el ScrollTrigger al desmontar', () => {
    const { unmount } = renderCanvas()
    const trigger = vi.mocked(ScrollTrigger.create).mock.results.at(-1)?.value as ScrollTrigger
    const kill = vi.spyOn(trigger, 'kill')
    unmount()
    expect(kill).toHaveBeenCalled()
  })
})
