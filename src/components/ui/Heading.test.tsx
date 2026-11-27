import { describe, expect, it } from 'vitest'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { Heading } from './Heading'

describe('<Heading />', () => {
  it('renderiza antetítulo, h2 con id y entradilla', async () => {
    const { container } = renderWithProviders(
      <Heading id="h" eyebrow="Servicios" title="Todo lo que necesitas" intro="Intro" />,
    )
    const heading = screen.getByRole('heading', { level: 2, name: 'Todo lo que necesitas' })
    expect(heading).toHaveAttribute('id', 'h')
    expect(screen.getByText('Servicios')).toBeInTheDocument()
    expect(screen.getByText('Intro')).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('usa h1 y tamaño display en el titular principal', () => {
    renderWithProviders(<Heading id="h" eyebrow="E" title="Titular" level={1} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('text-display')
  })

  it('omite la entradilla si no hay', () => {
    const { container } = renderWithProviders(<Heading id="h" eyebrow="E" title="T" />)
    expect(container.querySelectorAll('p')).toHaveLength(1)
  })
})
