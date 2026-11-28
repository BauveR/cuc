import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent } from '@testing-library/react'
import { existsSync, statSync } from 'node:fs'
import { axe, renderWithProviders, screen, setMatchMedia } from '@/test/renderWithProviders'
import { HeroVideo } from './HeroVideo'
import { HERO_VIDEO } from './video.config'

const afterLoad = vi.hoisted(() => ({ value: true }))
vi.mock('@/hooks/useAfterLoad', () => ({ useAfterLoad: () => afterLoad.value }))
vi.mock('./useVideoScrub', () => ({ useVideoScrub: vi.fn() }))

const video = () => screen.getByTestId('hero-video').querySelector('video') as HTMLVideoElement
const frame = () => screen.getByTestId('hero-video').querySelector('img')

describe('<HeroVideo />', () => {
  beforeEach(() => {
    afterLoad.value = true
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue(undefined)
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined)
  })
  afterEach(() => setMatchMedia(() => false))

  it('vídeo silenciado, inline y sin controles; fotograma decorativo debajo', async () => {
    const { container } = renderWithProviders(<HeroVideo />)
    const v = video()
    expect(v.muted).toBe(true)
    expect(v).toHaveAttribute('playsinline')
    expect(v).not.toHaveAttribute('controls')
    expect(frame()).toHaveAttribute('alt', '')
    expect(await axe(container)).toHaveNoViolations()
  })

  it('usa el encuadre horizontal en recuadros anchos y el vertical en altos (al rotar)', () => {
    renderWithProviders(<HeroVideo />)
    expect(video()).toHaveAttribute('src', HERO_VIDEO.landscape.src)
    act(() => setMatchMedia((q) => q === HERO_VIDEO.portraitQuery))
    expect(video()).toHaveAttribute('src', HERO_VIDEO.portrait.src)
    expect(frame()).toHaveAttribute('src', HERO_VIDEO.portrait.poster.webp)
  })

  it('aparece al cargar datos y se "despierta" (play+pause) para iOS', async () => {
    renderWithProviders(<HeroVideo />)
    const v = video()
    expect(v).toHaveAttribute('data-loaded', 'false')
    fireEvent.loadedMetadata(v)
    fireEvent.loadedData(v)
    expect(v).toHaveAttribute('data-loaded', 'true')
    await vi.waitFor(() => expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled())
  })

  it('sin vídeo antes del load o con reduced-motion: solo el fotograma', () => {
    afterLoad.value = false
    const { unmount } = renderWithProviders(<HeroVideo />)
    expect(video()).toBeNull()
    unmount()
    afterLoad.value = true
    setMatchMedia((q) => q.includes('prefers-reduced-motion'))
    renderWithProviders(<HeroVideo />)
    expect(video()).toBeNull()
    expect(frame()).toBeInTheDocument()
  })
})

describe('ficheros del vídeo', () => {
  it.each(['landscape', 'portrait'] as const)('"%s": mp4 dentro de presupuesto y fotogramas', (name) => {
    const r = HERO_VIDEO[name]
    for (const path of [r.src, r.poster.avif, r.poster.webp]) expect(existsSync(`public${path}`), path).toBe(true)
    expect(statSync(`public${r.src}`).size).toBeLessThanOrEqual(HERO_VIDEO.maxBytes)
  })
})
