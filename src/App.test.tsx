import { describe, expect, it, vi } from 'vitest'
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

  it('sin intro no hay cortinilla y la página es interactiva', () => {
    renderWithProviders(<App />)
    expect(screen.queryByTestId('intro-curtain')).not.toBeInTheDocument()
    expect(screen.getByRole('main').closest('[inert]')).toBeNull()
  })

  it('con intro muestra la cortinilla y deja la página inerte bajo ella', () => {
    renderWithProviders(<App onIntroLift={vi.fn()} />)
    expect(screen.getByTestId('intro-curtain')).toBeInTheDocument()
    expect(screen.getByTestId('hero-backdrop').closest('[inert]')).not.toBeNull()
  })

  it('no tiene violaciones de accesibilidad detectables', async () => {
    const { container } = renderWithProviders(<App />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
