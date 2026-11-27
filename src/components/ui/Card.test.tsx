import { describe, expect, it } from 'vitest'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { Card } from './Card'

describe('<Card />', () => {
  it('renderiza un artículo con título h3, kicker, badge y contenido', async () => {
    const { container } = renderWithProviders(
      <Card title="Ciberseguridad" kicker="Sector" badge="Caso ilustrativo">
        <p>Detalle</p>
      </Card>,
    )
    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Ciberseguridad' })).toBeInTheDocument()
    expect(screen.getByText('Caso ilustrativo')).toBeInTheDocument()
    expect(screen.getByText('Sector')).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })

  it('no renderiza la fila de etiquetas si no hay badge ni kicker', () => {
    renderWithProviders(<Card title="Cloud" />)
    expect(screen.getByRole('article').children).toHaveLength(1)
  })
})
