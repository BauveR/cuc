import { describe, expect, it } from 'vitest'
import { axe, renderWithProviders } from '@/test/renderWithProviders'
import { Wordmark } from './Wordmark'
import { WORDMARK_HALF_PATHS, WORDMARK_REPEAT_DX } from './wordmark.paths'

describe('<Wordmark />', () => {
  it('es decorativo: oculto a lectores y sin foco', () => {
    const { container } = renderWithProviders(<Wordmark />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('focusable', 'false')
    expect(svg).toHaveAttribute('fill', 'currentColor')
  })

  it('dibuja la mitad y la repite desplazada (6 «CUC» en total)', () => {
    const { container } = renderWithProviders(<Wordmark />)
    expect(container.querySelectorAll('path')).toHaveLength(WORDMARK_HALF_PATHS.length * 2)
    expect(container.querySelector('g')).toHaveAttribute('transform', `translate(${WORDMARK_REPEAT_DX} 0)`)
  })

  it('la geometría son trazos SVG válidos', () => {
    for (const d of WORDMARK_HALF_PATHS) expect(d).toMatch(/^M[\d.,\s-]/)
  })

  it('no tiene violaciones de accesibilidad dentro de un enlace con nombre', async () => {
    const { container } = renderWithProviders(
      <a href="#inicio" aria-label="CUC">
        <Wordmark />
      </a>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
