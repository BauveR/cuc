import { describe, expect, it } from 'vitest'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { getContent } from '@/content'
import { App } from './App'

const { brand } = getContent()

describe('<App />', () => {
  it('renderiza el nombre de marca como encabezado principal', () => {
    renderWithProviders(<App />)
    expect(screen.getByRole('heading', { level: 1, name: brand.name })).toBeInTheDocument()
  })

  it('expone un landmark main', () => {
    renderWithProviders(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('no tiene violaciones de accesibilidad detectables', async () => {
    const { container } = renderWithProviders(<App />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
