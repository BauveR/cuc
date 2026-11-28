import { describe, expect, it, vi } from 'vitest'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { MenuToggle } from './MenuToggle'

const LABELS = { open: 'Menú', close: 'Cerrar' }

describe('<MenuToggle />', () => {
  it('cerrado: muestra "Menú" y aria-expanded=false', () => {
    renderWithProviders(<MenuToggle open={false} onToggle={vi.fn()} controls="m" labels={LABELS} />)
    const button = screen.getByRole('button', { name: 'Menú' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', 'm')
  })

  it('abierto: muestra "Cerrar" y aria-expanded=true', () => {
    renderWithProviders(<MenuToggle open onToggle={vi.fn()} controls="m" labels={LABELS} />)
    expect(screen.getByRole('button', { name: 'Cerrar' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('notifica el clic', async () => {
    const onToggle = vi.fn()
    const { user } = renderWithProviders(
      <MenuToggle open={false} onToggle={onToggle} controls="m" labels={LABELS} />,
    )
    await user.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(
      <MenuToggle open={false} onToggle={vi.fn()} controls="m" labels={LABELS} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
