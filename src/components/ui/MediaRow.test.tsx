import { describe, expect, it } from 'vitest'
import { getContent } from '@/content/site'
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'
import { MediaRow } from './MediaRow'
import { SplitBlock } from './SplitBlock'

const { media } = getContent()

describe('<MediaRow />', () => {
  it('muestra la imagen ancha (8 col) y la estrecha (4 col)', async () => {
    const { container } = renderWithProviders(
      <MediaRow wide={{ id: 'office', alt: media.office }} narrow={{ id: 'network', alt: media.network }} />,
    )
    expect(screen.getByRole('img', { name: media.office }).closest('.md\\:col-span-8')).not.toBeNull()
    expect(screen.getByRole('img', { name: media.network }).closest('.md\\:col-span-4')).not.toBeNull()
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe('<SplitBlock />', () => {
  it('coloca el texto en 6 columnas y la imagen en las otras 6', async () => {
    const { container } = renderWithProviders(
      <SplitBlock image={{ id: 'workspace', alt: media.workspace }}>
        <p>Texto</p>
      </SplitBlock>,
    )
    expect(screen.getByText('Texto').closest('.md\\:col-span-6')).not.toBeNull()
    expect(screen.getByRole('img', { name: media.workspace }).closest('.md\\:col-span-6')).not.toBeNull()
    expect(await axe(container)).toHaveNoViolations()
  })
})
