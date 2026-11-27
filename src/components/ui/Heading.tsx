import { RevealText } from '@/components/RevealText/RevealText'
import { cx } from '@/lib/cx'

interface HeadingProps {
  /** id del título: lo referencia la <Section> con aria-labelledby. */
  readonly id: string
  readonly eyebrow: string
  readonly title: string
  readonly intro?: string
  /** 1 solo para el titular principal de la página. */
  readonly level?: 1 | 2
  readonly inverse?: boolean
}

/** Cabecera editorial: antetítulo + título revelado por líneas + entradilla. */
export function Heading({ id, eyebrow, title, intro, level = 2, inverse = false }: HeadingProps) {
  const muted = inverse ? 'text-on-inverse-muted' : 'text-ink-muted'

  return (
    <header className="flex max-w-5xl flex-col gap-4">
      <p className={cx('text-caption font-medium uppercase', muted)}>{eyebrow}</p>
      <RevealText
        as={level === 1 ? 'h1' : 'h2'}
        id={id}
        className={cx('font-semibold break-words', level === 1 ? 'text-display' : 'text-headline')}
      >
        {title}
      </RevealText>
      {intro && <p className={cx('max-w-prose text-lead', muted)}>{intro}</p>}
    </header>
  )
}
