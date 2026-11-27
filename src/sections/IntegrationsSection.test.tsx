import { describe, expect, it } from 'vitest'
import { getContent } from '@/content/site'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { IntegrationsSection } from './IntegrationsSection'

const { integrations } = getContent()

describe('<IntegrationsSection />', () => {
  it('agrupa las herramientas en listas nombradas por categoría', () => {
    renderWithProviders(<IntegrationsSection content={integrations} />)
    for (const group of integrations.items) {
      const list = screen.getByRole('list', { name: group.category })
      expect(list.children).toHaveLength(group.tools.length)
    }
  })

  it('usa el ancla de integraciones', () => {
    renderWithProviders(<IntegrationsSection content={integrations} />)
    expect(screen.getByRole('region', { name: integrations.title })).toHaveAttribute('id', 'integraciones')
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(<IntegrationsSection content={integrations} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
