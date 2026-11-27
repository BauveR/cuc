import { describe, expect, it } from 'vitest'
import { SECTION_IDS, getContent } from '@/content/site'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { Home } from './Home'

const content = getContent()

describe('<Home />', () => {
  it('renderiza las secciones en orden', () => {
    const { container } = renderWithProviders(<Home content={content} />)
    const ids = [...container.querySelectorAll('section')].map((s) => s.id)
    expect(ids).toEqual([
      SECTION_IDS.intro,
      SECTION_IDS.services,
      SECTION_IDS.integrations,
      SECTION_IDS.process,
      SECTION_IDS.sectors,
      SECTION_IDS.cases,
      SECTION_IDS.contact,
    ])
  })

  it('tiene un único h1', () => {
    renderWithProviders(<Home content={content} />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('todas las anclas internas apuntan a una sección renderizada', () => {
    const { container } = renderWithProviders(<Home content={content} />)
    for (const link of container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
      const id = link.getAttribute('href')?.slice(1) ?? ''
      expect(container.querySelector(`#${id}`), `#${id}`).not.toBeNull()
    }
  })

  it('no tiene violaciones de accesibilidad en conjunto', async () => {
    const { container } = renderWithProviders(<Home content={content} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
