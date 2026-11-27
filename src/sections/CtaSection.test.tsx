import { describe, expect, it } from 'vitest'
import { getContent } from '@/content/site'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { CtaSection } from './CtaSection'

const { cta } = getContent()

describe('<CtaSection />', () => {
  it('es el destino #contacto de los CTA y usa tono inverso', () => {
    renderWithProviders(<CtaSection content={cta} />)
    const region = screen.getByRole('region', { name: cta.title })
    expect(region).toHaveAttribute('id', 'contacto')
    expect(region).toHaveAttribute('data-tone', 'inverse')
  })

  it('muestra la acción con su destino', () => {
    renderWithProviders(<CtaSection content={cta} />)
    expect(screen.getByRole('link', { name: cta.action.label })).toHaveAttribute('href', cta.action.href)
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(<CtaSection content={cta} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
