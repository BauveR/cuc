import { describe, expect, it } from 'vitest'
import { getContent } from '@/content/site'
import { axe, renderWithProviders, screen, within } from '@/test/renderWithProviders'
import { ServicesSection } from './ServicesSection'

const { services, media } = getContent()
const IMAGE = { id: 'workspace' as const, alt: media.workspace }

describe('<ServicesSection />', () => {
  it('renderiza una card (h3) por servicio', () => {
    renderWithProviders(<ServicesSection content={services} image={IMAGE} />)
    const region = screen.getByRole('region', { name: services.title })
    const titles = within(region).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(titles).toEqual(services.items.map((s) => s.title))
  })

  it('incluye resumen y puntos de cada servicio', () => {
    renderWithProviders(<ServicesSection content={services} image={IMAGE} />)
    const [first] = services.items
    expect(screen.getByText(first?.summary ?? '')).toBeInTheDocument()
    for (const point of first?.points ?? []) expect(screen.getByText(point)).toBeInTheDocument()
  })

  it('acompaña el titular con su imagen (texto alternativo)', () => {
    renderWithProviders(<ServicesSection content={services} image={IMAGE} />)
    expect(screen.getByRole('img', { name: IMAGE.alt })).toBeInTheDocument()
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(<ServicesSection content={services} image={IMAGE} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
