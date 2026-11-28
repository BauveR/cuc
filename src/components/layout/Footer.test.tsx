import { describe, expect, it } from 'vitest'
import { getContent } from '@/content/site'
import { axe, renderWithProviders, screen, within } from '@/test/renderWithProviders'
import { Footer } from './Footer'

const content = getContent()
const { footer } = content

describe('<Footer />', () => {
  it('es un contentinfo con una columna nombrada por grupo de enlaces', () => {
    renderWithProviders(<Footer content={content} year={2026} />)
    expect(screen.getByRole('contentinfo', { name: footer.label })).toBeInTheDocument()
    for (const column of footer.columns) {
      const region = screen.getByRole('region', { name: column.title })
      expect(within(region).getAllByRole('link')).toHaveLength(column.links.length)
    }
  })

  it('incluye legales y redes; las externas con rel noopener noreferrer', () => {
    renderWithProviders(<Footer content={content} year={2026} />)
    expect(screen.getByRole('link', { name: 'Privacidad' })).toHaveAttribute('href', '/privacidad')
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('muestra el copyright con el año indicado', () => {
    renderWithProviders(<Footer content={content} year={2030} />)
    expect(screen.getByText(new RegExp(`© 2030 ${content.brand.name.replace(/[[\]]/g, '\\$&')}`))).toBeInTheDocument()
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(<Footer content={content} year={2026} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
