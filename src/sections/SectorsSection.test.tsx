import { describe, expect, it } from 'vitest'
import { getContent } from '@/content/site'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { SectorsSection } from './SectorsSection'

const { sectors, media } = getContent()
const IMAGE = { id: 'barcelona' as const, alt: media.barcelona }

describe('<SectorsSection />', () => {
  it('renderiza un artículo por sector con nombre y descripción', () => {
    renderWithProviders(<SectorsSection content={sectors} image={IMAGE} />)
    expect(screen.getAllByRole('article')).toHaveLength(sectors.items.length)
    for (const sector of sectors.items) {
      expect(screen.getByRole('heading', { level: 3, name: sector.name })).toBeInTheDocument()
      expect(screen.getByText(sector.description)).toBeInTheDocument()
    }
  })

  it('acompaña el titular con su imagen (texto alternativo)', () => {
    renderWithProviders(<SectorsSection content={sectors} image={IMAGE} />)
    expect(screen.getByRole('img', { name: IMAGE.alt })).toBeInTheDocument()
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(<SectorsSection content={sectors} image={IMAGE} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
