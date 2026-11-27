import { describe, expect, it } from 'vitest'
import { getContent } from '@/content/site'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { IntroSection } from './IntroSection'

const { hero } = getContent()

describe('<IntroSection />', () => {
  it('es el único h1 y nombra la sección', () => {
    renderWithProviders(<IntroSection content={hero} />)
    expect(screen.getByRole('heading', { level: 1, name: hero.title })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: hero.title })).toHaveAttribute('id', 'inicio')
  })

  it('muestra la entradilla y los dos CTA con sus destinos', () => {
    renderWithProviders(<IntroSection content={hero} />)
    expect(screen.getByText(hero.lead)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: hero.primaryCta.label })).toHaveAttribute('href', hero.primaryCta.href)
    expect(screen.getByRole('link', { name: hero.secondaryCta.label })).toHaveAttribute('href', hero.secondaryCta.href)
  })

  it('es transparente para dejar ver el hero 3D', () => {
    renderWithProviders(<IntroSection content={hero} />)
    expect(screen.getByRole('region')).toHaveAttribute('data-tone', 'transparent')
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(<IntroSection content={hero} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
