import { afterEach, describe, expect, it, vi } from 'vitest'
import { gsap } from '@/lib/gsap'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { IntroCurtain } from './IntroCurtain'
import { HEART, HEART_COUNT, MONOGRAM } from '@/components/brand/marks.paths'
import { shouldPlayIntro } from './introGate'

const renderCurtain = () => {
  const onLift = vi.fn()
  const onDone = vi.fn()
  return { onLift, onDone, ...renderWithProviders(<IntroCurtain onLift={onLift} onDone={onDone} />) }
}

describe('<IntroCurtain />', () => {
  afterEach(() => window.sessionStorage.clear())

  it('panel papel a pantalla completa y, en otra capa, el monograma y 10 corazones', async () => {
    const { container } = renderCurtain()
    const curtain = screen.getByTestId('intro-curtain')
    expect(curtain).toHaveAttribute('aria-hidden', 'true')
    const panel = curtain.querySelector('[data-intro-panel]')
    expect(panel).toHaveClass('fixed', 'inset-0', 'bg-paper')
    expect(panel?.querySelector('svg')).toBeNull() // los elementos no suben con el panel
    expect(curtain.querySelectorAll('[data-heart]')).toHaveLength(HEART_COUNT)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('los trazos son geometría SVG válida (no atributos sueltos)', () => {
    for (const d of [MONOGRAM.path, HEART.path]) expect(d).toMatch(/^M[\d.,\s-]/)
    renderCurtain()
    const paths = screen.getByTestId('intro-curtain').querySelectorAll('path')
    expect(paths[0]).toHaveAttribute('d', MONOGRAM.path)
    expect(paths[1]).toHaveAttribute('d', HEART.path)
  })

  it('bloquea el scroll mientras está y lo libera al desmontar', () => {
    const { unmount } = renderCurtain()
    expect(document.documentElement.style.overflow).toBe('hidden')
    unmount()
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('marca la sesión: no se repetirá al recargar', () => {
    renderCurtain()
    expect(shouldPlayIntro()).toBe(false)
  })

  it('libera los reveals al empezar a subir y avisa al terminar', () => {
    const { onLift, onDone } = renderCurtain()
    expect(onLift).not.toHaveBeenCalled()
    gsap.globalTimeline.progress(1, false) // salta al final de la línea de tiempo
    expect(onLift).toHaveBeenCalledTimes(1)
    expect(onDone).toHaveBeenCalledTimes(1)
  })
})
