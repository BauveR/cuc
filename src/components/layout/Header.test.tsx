import { describe, expect, it } from 'vitest'
import { getContent } from '@/content/site'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { Header } from './Header'

const content = getContent()
const { layout } = content

describe('<Header />', () => {
  it('es un banner con la marca enlazada al inicio y la navegación principal', () => {
    renderWithProviders(<Header content={content} />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: content.brand.name })).toHaveAttribute('href', '#inicio')
    expect(screen.getByRole('navigation', { name: layout.navLabel })).toBeInTheDocument()
  })

  it('el botón Menú abre el overlay y Cerrar lo cierra devolviendo el foco', async () => {
    const { user } = renderWithProviders(<Header content={content} />)
    const toggle = screen.getByRole('button', { name: layout.menu.open })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: layout.menu.close })).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: layout.menu.close }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(toggle).toHaveFocus()
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(<Header content={content} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
