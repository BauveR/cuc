import { describe, expect, it, vi } from 'vitest'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { cx } from '@/lib/cx'
import { LINK_VARIANTS, SafeLink } from './SafeLink'

describe('<SafeLink />', () => {
  it('renderiza un enlace interno sin rel', () => {
    renderWithProviders(<SafeLink href="#contacto">Contacto</SafeLink>)
    const link = screen.getByRole('link', { name: 'Contacto' })
    expect(link).toHaveAttribute('href', '#contacto')
    expect(link).not.toHaveAttribute('rel')
  })

  it('protege los enlaces externos con noopener noreferrer', () => {
    renderWithProviders(<SafeLink href="https://example.com">Web</SafeLink>)
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it.each(['javascript:alert(1)', 'data:text/html,x', '//evil.example'])(
    'no renderiza como enlace un href inseguro: %s',
    (href) => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      renderWithProviders(<SafeLink href={href}>Peligro</SafeLink>)
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.getByText('Peligro')).toBeInTheDocument()
    },
  )

  it('aplica la variante visual', () => {
    renderWithProviders(
      <SafeLink href="/" variant="primary">
        Inicio
      </SafeLink>,
    )
    expect(screen.getByRole('link')).toHaveClass(...LINK_VARIANTS.primary.split(' '))
  })

  it('la variante plain solo subraya en hover/foco (listas de navegación)', () => {
    renderWithProviders(
      <SafeLink href="#a" variant="plain">
        Nav
      </SafeLink>,
    )
    expect(screen.getByRole('link')).toHaveClass('no-underline', 'hover:underline', 'focus-visible:underline')
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(<SafeLink href="mailto:hola@example.com">Email</SafeLink>)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('cx', () => {
  it('une clases ignorando valores vacíos', () => {
    expect(cx('a', false, null, undefined, '', 'b')).toBe('a b')
  })
})
