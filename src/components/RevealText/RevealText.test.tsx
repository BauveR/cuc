import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SplitText } from '@/lib/gsap'
import { axe, renderWithProviders, screen, setMatchMedia } from '@/test/renderWithProviders'
import { RevealText } from './RevealText'

const TEXT = 'Tecnología que trabaja para tu pyme'

describe('<RevealText />', () => {
  beforeEach(() => {
    vi.spyOn(SplitText, 'create')
  })

  it('renderiza un párrafo con el texto completo como nombre accesible', () => {
    renderWithProviders(<RevealText>{TEXT}</RevealText>)
    // SplitText (aria: 'auto') etiqueta el contenedor y oculta las líneas.
    expect(screen.getByLabelText(TEXT).tagName).toBe('P')
  })

  it('respeta la etiqueta semántica indicada', () => {
    renderWithProviders(<RevealText as="h2">{TEXT}</RevealText>)
    expect(screen.getByRole('heading', { level: 2, name: TEXT })).toBeInTheDocument()
  })

  it('divide por líneas con máscara y aria automático', () => {
    renderWithProviders(<RevealText>{TEXT}</RevealText>)
    expect(SplitText.create).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ type: 'lines', mask: 'lines', aria: 'auto' }),
    )
  })

  it('no anima ni divide con prefers-reduced-motion', () => {
    setMatchMedia((q) => q.includes('reduce'))
    renderWithProviders(<RevealText>{TEXT}</RevealText>)
    expect(SplitText.create).not.toHaveBeenCalled()
    expect(screen.getByText(TEXT)).toBeInTheDocument()
  })

  it('mantiene un nombre accesible completo y sin violaciones', async () => {
    const { container } = renderWithProviders(<RevealText as="h1">{TEXT}</RevealText>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName(TEXT)
    expect(await axe(container)).toHaveNoViolations()
  })
})
