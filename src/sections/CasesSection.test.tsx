import { describe, expect, it } from 'vitest'
import { getContent, type SiteContent } from '@/content/site'
import { axe, renderWithProviders, screen, within } from '@/test/renderWithProviders'
import { CasesSection } from './CasesSection'

const { cases } = getContent()

describe('<CasesSection />', () => {
  it('etiqueta visiblemente cada caso ilustrativo', () => {
    renderWithProviders(<CasesSection content={cases} />)
    const illustrative = cases.items.filter((c) => c.illustrative).length
    expect(screen.getAllByText(cases.labels.illustrative)).toHaveLength(illustrative)
  })

  it('no etiqueta como ilustrativo un caso real', () => {
    const real: SiteContent['cases'] = {
      ...cases,
      items: cases.items.slice(0, 1).map((c) => ({ ...c, illustrative: false })),
    }
    renderWithProviders(<CasesSection content={real} />)
    expect(screen.queryByText(cases.labels.illustrative)).not.toBeInTheDocument()
  })

  it('muestra reto, solución y resultado en una lista de definiciones', () => {
    renderWithProviders(<CasesSection content={cases} />)
    const [first] = screen.getAllByRole('article')
    const card = within(first as HTMLElement)
    expect(card.getByText(cases.labels.challenge).tagName).toBe('DT')
    expect(card.getByText(cases.items[0]?.outcome ?? '').tagName).toBe('DD')
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(<CasesSection content={cases} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
