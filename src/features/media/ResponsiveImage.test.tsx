import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { getContent, type ImageId } from '@/content/site'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { IMAGES, IMAGE_WIDTHS, imageUrl } from './images'
import { ResponsiveImage } from './ResponsiveImage'

const { media } = getContent()

describe('<ResponsiveImage />', () => {
  it('renderiza una imagen con alt, srcset WebP y fuente AVIF', () => {
    const { container } = renderWithProviders(
      <ResponsiveImage id="team" alt={media.team} sizes="100vw" />,
    )
    const img = screen.getByRole('img', { name: media.team })
    expect(img).toHaveAttribute('srcset', expect.stringContaining('/images/team-640.webp 640w'))
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(container.querySelector('source')).toHaveAttribute('type', 'image/avif')
  })

  it('reserva el espacio con width/height (sin CLS)', () => {
    renderWithProviders(<ResponsiveImage id="office" alt={media.office} sizes="50vw" />)
    expect(screen.getByRole('img')).toHaveAttribute('width', String(IMAGES.office.width))
    expect(screen.getByRole('img')).toHaveAttribute('height', String(IMAGES.office.height))
  })

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = renderWithProviders(
      <ResponsiveImage id="barcelona" alt={media.barcelona} sizes="100vw" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('catálogo de imágenes', () => {
  it.each(Object.keys(IMAGES) as ImageId[])('"%s" existe en todos los anchos y formatos', (id) => {
    for (const w of IMAGE_WIDTHS) {
      for (const f of ['avif', 'webp'] as const) {
        expect(existsSync(`public${imageUrl(id, w, f)}`), imageUrl(id, w, f)).toBe(true)
      }
    }
  })

  it('cada imagen tiene texto alternativo no vacío', () => {
    for (const id of Object.keys(IMAGES) as ImageId[]) expect(media[id].trim()).not.toBe('')
  })
})
