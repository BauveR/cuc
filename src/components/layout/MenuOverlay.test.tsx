import { describe, expect, it, vi } from 'vitest'
import { getContent } from '@/content/site'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { MenuOverlay } from './MenuOverlay'

const { layout, brand } = getContent()

const renderMenu = (onClose = vi.fn()) => ({
  onClose,
  ...renderWithProviders(
    <MenuOverlay id="menu" layout={layout} brand={brand.name} lang="es" onClose={onClose} />,
  ),
})

describe('<MenuOverlay />', () => {
  it('es un diálogo modal con nombre y navegación', () => {
    renderMenu()
    const dialog = screen.getByRole('dialog', { name: layout.menu.dialogLabel })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getAllByRole('link')).toHaveLength(layout.nav.length)
  })

  it('lleva el foco dentro al abrirse (botón Cerrar)', () => {
    renderMenu()
    expect(screen.getByRole('button', { name: layout.menu.close })).toHaveFocus()
  })

  it('Tab y Shift+Tab ciclan dentro del menú (foco atrapado)', async () => {
    const { user } = renderMenu()
    const links = screen.getAllByRole('link')
    const close = screen.getByRole('button', { name: layout.menu.close })
    await user.tab({ shift: true })
    expect(links.at(-1)).toHaveFocus()
    await user.tab()
    expect(close).toHaveFocus()
  })

  it('Escape cierra el menú', async () => {
    const { user, onClose } = renderMenu()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })

  it('bloquea el scroll de la página mientras está abierto', () => {
    const { unmount } = renderMenu()
    expect(document.documentElement.style.overflow).toBe('hidden')
    unmount()
    expect(document.documentElement.style.overflow).toBe('')
  })

  it('al elegir un enlace cierra el menú', async () => {
    const { user, onClose } = renderMenu()
    await user.click(screen.getByRole('link', { name: 'Proceso' }))
    expect(onClose).toHaveBeenCalled()
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderMenu()
    expect(await axe(container)).toHaveNoViolations()
  })
})
