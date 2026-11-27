import { describe, expect, it } from 'vitest'
import { getContent } from '@/content/site'
import { axe, renderWithProviders, screen, within } from '@/test/renderWithProviders'
import { ProcessSection, stepNumber } from './ProcessSection'

const { process } = getContent()

describe('<ProcessSection />', () => {
  it('usa una lista ordenada con un paso por elemento', () => {
    renderWithProviders(<ProcessSection content={process} />)
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('OL')
    expect(within(list).getAllByRole('listitem')).toHaveLength(process.steps.length)
  })

  it('numera 01–05 de forma decorativa (oculta a lectores)', () => {
    renderWithProviders(<ProcessSection content={process} />)
    const number = screen.getByText('01')
    expect(number).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText(stepNumber(process.steps.length - 1))).toBeInTheDocument()
  })

  it('formatea el número de paso con dos dígitos', () => {
    expect(stepNumber(0)).toBe('01')
    expect(stepNumber(9)).toBe('10')
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(<ProcessSection content={process} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
