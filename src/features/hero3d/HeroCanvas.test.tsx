import { beforeEach, describe, expect, it, vi } from 'vitest'
import { invalidate } from '@react-three/fiber'
import { render, screen } from '@testing-library/react'
import { ScrollTrigger } from '@/lib/gsap'
import HeroCanvas from './HeroCanvas'
import { scrollState } from './scrollState'

type Config = Parameters<typeof ScrollTrigger.create>[0]
const lastConfig = (): Config | undefined => vi.mocked(ScrollTrigger.create).mock.calls.at(-1)?.[0]

describe('<HeroCanvas />', () => {
  beforeEach(() => {
    vi.spyOn(ScrollTrigger, 'create')
  })

  it('renderiza el canvas como elemento decorativo', () => {
    render(<HeroCanvas onReady={vi.fn()} />)
    expect(screen.getByTestId('r3f-canvas')).toHaveAttribute('aria-hidden', 'true')
  })

  it('sigue el progreso de toda la página', () => {
    render(<HeroCanvas onReady={vi.fn()} />)
    expect(lastConfig()).toMatchObject({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
    })
  })

  it('escribe el progreso fuera de React y pide un frame', () => {
    render(<HeroCanvas onReady={vi.fn()} />)
    lastConfig()?.onUpdate?.({ progress: 0.42 } as ScrollTrigger)
    expect(scrollState.progress).toBe(0.42)
    expect(invalidate).toHaveBeenCalled()
  })

  it('destruye el ScrollTrigger al desmontar', () => {
    const { unmount } = render(<HeroCanvas onReady={vi.fn()} />)
    const trigger = vi.mocked(ScrollTrigger.create).mock.results.at(-1)?.value as ScrollTrigger
    const kill = vi.spyOn(trigger, 'kill')
    unmount()
    expect(kill).toHaveBeenCalled()
  })
})
