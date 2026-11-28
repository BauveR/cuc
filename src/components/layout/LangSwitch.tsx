import type { LayoutContent } from '@/content/site'
import { cx } from '@/lib/cx'

interface LangSwitchProps {
  readonly languages: LayoutContent['languages']
  /** Idioma actual de la página. */
  readonly current: string
  /** Sustituye la separación por defecto (gap-3) si se pasa. */
  readonly className?: string
}

/**
 * Selector de idioma. Los idiomas sin traducir se muestran deshabilitados
 * (aria-disabled + "próximamente" para lectores): no hay enlaces a páginas
 * vacías. Cuando exista la traducción, cada opción pasará a ser un enlace.
 */
export function LangSwitch({ languages, current, className }: LangSwitchProps) {
  return (
    <ul aria-label={languages.label} className={cx('flex', className ?? 'gap-3')}>
      {languages.options.map((option) => {
        const isCurrent = option.code === current
        return (
          <li key={option.code}>
            <span
              lang={option.code}
              title={option.available ? option.name : `${option.name} (${languages.unavailable})`}
              {...(isCurrent && { 'aria-current': 'true' as const })}
              {...(!option.available && { 'aria-disabled': 'true' as const })}
              className={cx(isCurrent ? 'underline underline-offset-4' : 'text-ink-muted')}
            >
              <span aria-hidden="true">{option.label}</span>
              <span className="sr-only">
                {option.name}
                {!option.available && ` (${languages.unavailable})`}
              </span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
