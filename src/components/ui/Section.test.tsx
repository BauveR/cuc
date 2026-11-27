import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen } from '@/test/renderWithProviders'
import { Section } from './Section'

describe('<Section />', () => {
  const renderSection = (tone?: 'inverse') =>
    renderWithProviders(
      <Section id="servicios" labelledBy="t" {...(tone && { tone })}>
        <h2 id="t">Servicios</h2>
      </Section>,
    )

  it('es un landmark con nombre accesible, ancla y data-section', () => {
    renderSection()
    const region = screen.getByRole('region', { name: 'Servicios' })
    expect(region).toHaveAttribute('id', 'servicios')
    expect(region).toHaveAttribute('data-section', 'servicios')
    expect(region).toHaveAttribute('data-tone', 'paper')
  })

  it('aplica el tono indicado', () => {
    renderSection('inverse')
    expect(screen.getByRole('region')).toHaveClass('bg-inverse', 'text-on-inverse')
  })
})
