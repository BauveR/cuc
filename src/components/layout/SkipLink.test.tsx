import { describe, expect, it } from 'vitest'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { SkipLink } from './SkipLink'

describe('<SkipLink />', () => {
  it('apunta al <main> (#contenido) con su texto', () => {
    renderWithProviders(<SkipLink label="Saltar al contenido" />)
    expect(screen.getByRole('link', { name: 'Saltar al contenido' })).toHaveAttribute('href', '#contenido')
  })

  it('está oculto visualmente hasta recibir foco', () => {
    renderWithProviders(<SkipLink label="Saltar" />)
    expect(screen.getByRole('link')).toHaveClass('sr-only', 'focus:not-sr-only')
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(<SkipLink label="Saltar" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
