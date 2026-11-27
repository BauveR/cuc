import { describe, expect, it } from 'vitest'
import { SECTION_IDS, getContent } from '@/content/site'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { App } from './App'

const { hero } = getContent()

describe('<App />', () => {
  it('renderiza el claim como encabezado principal', () => {
    renderWithProviders(<App />)
    expect(screen.getByRole('heading', { level: 1, name: hero.title })).toBeInTheDocument()
  })

  it('expone el landmark main con el ancla del SkipLink y foco programático', () => {
    renderWithProviders(<App />)
    const main = screen.getByRole('main')
    expect(main).toHaveAttribute('id', SECTION_IDS.main)
    expect(main).toHaveAttribute('tabindex', '-1')
  })

  it('incluye el fondo 3D decorativo fuera del main', () => {
    renderWithProviders(<App />)
    expect(screen.getByRole('main')).not.toContainElement(screen.getByTestId('hero-backdrop'))
  })

  it('no tiene violaciones de accesibilidad detectables', async () => {
    const { container } = renderWithProviders(<App />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
