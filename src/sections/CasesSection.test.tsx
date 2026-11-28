import { describe, expect, it } from 'vitest'
import { getContent, type SiteContent } from '@/content/site'
import { axe, renderWithProviders, screen, within } from '@/test/renderWithProviders'
import { CasesSection } from './CasesSection'

const { cases, media } = getContent()
const IMAGE = { id: 'team' as const, alt: media.team }

describe('<CasesSection />', () => {
  it('etiqueta visiblemente cada caso ilustrativo', () => {
    renderWithProviders(<CasesSection content={cases} image={IMAGE} />)
    const illustrative = cases.items.filter((c) => c.illustrative).length
    expect(screen.getAllByText(cases.labels.illustrative)).toHaveLength(illustrative)
  })

  it('no etiqueta como ilustrativo un caso real', () => {
    const real: SiteContent['cases'] = {
      ...cases,
      items: cases.items.slice(0, 1).map((c) => ({ ...c, illustrative: false })),
    }
    renderWithProviders(<CasesSection content={real} image={IMAGE} />)
    expect(screen.queryByText(cases.labels.illustrative)).not.toBeInTheDocument()
  })

  it('muestra reto, solución y resultado en una lista de definiciones', () => {
    renderWithProviders(<CasesSection content={cases} image={IMAGE} />)
    const [first] = screen.getAllByRole('article')
    const card = within(first as HTMLElement)
    expect(card.getByText(cases.labels.challenge).tagName).toBe('DT')
    expect(card.getByText(cases.items[0]?.outcome ?? '').tagName).toBe('DD')
  })

  it('acompaña el titular con su imagen (texto alternativo)', () => {
    renderWithProviders(<CasesSection content={cases} image={IMAGE} />)
    expect(screen.getByRole('img', { name: IMAGE.alt })).toBeInTheDocument()
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(<CasesSection content={cases} image={IMAGE} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
