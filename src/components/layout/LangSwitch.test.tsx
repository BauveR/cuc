import { describe, expect, it } from 'vitest'
import { getContent } from '@/content/site'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { LangSwitch } from './LangSwitch'

const { layout } = getContent()
const renderSwitch = () =>
  renderWithProviders(<LangSwitch languages={layout.languages} current="es" />)

describe('<LangSwitch />', () => {
  it('es una lista nombrada con ES, CA y EN', () => {
    renderSwitch()
    expect(screen.getByRole('list', { name: layout.languages.label }).children).toHaveLength(3)
  })

  it('marca el idioma actual con aria-current', () => {
    renderSwitch()
    expect(screen.getByText('Español').parentElement).toHaveAttribute('aria-current', 'true')
  })

  it('CA y EN aparecen deshabilitados y anunciados como "próximamente"', () => {
    renderSwitch()
    for (const name of ['Català', 'English']) {
      const label = screen.getByText(`${name} (${layout.languages.unavailable})`)
      expect(label.parentElement).toHaveAttribute('aria-disabled', 'true')
    }
    expect(screen.queryByRole('link')).not.toBeInTheDocument() // sin enlaces a páginas vacías
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderSwitch()
    expect(await axe(container)).toHaveNoViolations()
  })
})
