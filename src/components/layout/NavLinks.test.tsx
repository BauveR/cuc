import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/react'
import { getContent } from '@/content/site'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { NavLinks } from './NavLinks'

const { layout } = getContent()

describe('<NavLinks />', () => {
  it('renderiza un enlace por elemento de navegación', () => {
    renderWithProviders(<NavLinks links={layout.nav} />)
    expect(screen.getAllByRole('link')).toHaveLength(layout.nav.length)
    expect(screen.getByRole('link', { name: 'Servicios' })).toHaveAttribute('href', '#servicios')
  })

  it('con onNavigate intercepta el clic y entrega el destino', () => {
    const onNavigate = vi.fn()
    renderWithProviders(<NavLinks links={layout.nav} onNavigate={onNavigate} />)
    const link = screen.getByRole('link', { name: 'Casos' })
    const notPrevented = fireEvent.click(link)
    expect(notPrevented).toBe(false) // preventDefault
    expect(onNavigate).toHaveBeenCalledWith('#casos')
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(<NavLinks links={layout.nav} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
