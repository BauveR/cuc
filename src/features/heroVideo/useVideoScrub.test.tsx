import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRef } from 'react'
import { render } from '@testing-library/react'
import { ScrollTrigger, gsap } from '@/lib/gsap'
import { useVideoScrub } from './useVideoScrub'

type Config = Parameters<typeof ScrollTrigger.create>[0]
type Tick = () => void

function Harness({ enabled }: { readonly enabled: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  useVideoScrub(ref, 'inicio', enabled)
  return <video ref={ref} muted />
}

let tick: Tick = () => undefined
const config = (): Config => vi.mocked(ScrollTrigger.create).mock.calls[0]?.[0] ?? {}
const progress = (p: number) => config().onUpdate?.({ progress: p } as ScrollTrigger)

const mountVideo = (duration: number, seeking = false) => {
  const utils = render(<Harness enabled />)
  const video = utils.container.querySelector('video') as HTMLVideoElement
  Object.defineProperty(video, 'duration', { value: duration })
  Object.defineProperty(video, 'seeking', { value: seeking, configurable: true })
  return { ...utils, video }
}

describe('useVideoScrub', () => {
  let trigger: HTMLElement
  beforeEach(() => {
    trigger = Object.assign(document.createElement('section'), { id: 'inicio' })
    document.body.appendChild(trigger)
    vi.spyOn(ScrollTrigger, 'create')
    vi.spyOn(gsap.ticker, 'add').mockImplementation(((fn: Tick) => (tick = fn)) as never)
    vi.spyOn(gsap.ticker, 'remove')
  })
  afterEach(() => trigger.remove())

  it('mapea el progreso del hero (top top → bottom top) a currentTime', () => {
    const { video } = mountVideo(24)
    expect(config()).toMatchObject({ trigger, start: 'top top', end: 'bottom top' })
    progress(0.5)
    tick()
    expect(video.currentTime).toBe(12)
  })

  it('no encola seeks mientras el anterior sigue en curso', () => {
    const { video } = mountVideo(24, true)
    progress(1)
    tick()
    expect(video.currentTime).toBe(0)
  })

  it('no hace nada sin duración (metadatos aún no cargados)', () => {
    const { video } = mountVideo(Number.NaN)
    progress(0.5)
    expect(() => tick()).not.toThrow()
    expect(video.currentTime).toBe(0)
  })

  it('deshabilitado no crea triggers; al desmontar limpia ticker y trigger', () => {
    render(<Harness enabled={false} />)
    expect(ScrollTrigger.create).not.toHaveBeenCalled()
    const { unmount } = mountVideo(24)
    unmount()
    expect(gsap.ticker.remove).toHaveBeenCalledWith(tick)
  })
})
