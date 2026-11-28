import { SafeLink } from '@/components/ui/SafeLink'
import type { SiteContent } from '@/content/site'

interface FooterProps {
  readonly content: Pick<SiteContent, 'brand' | 'footer'>
  /** Año del copyright (inyectable para tests deterministas). */
  readonly year?: number
}

/**
 * Pie en banda de color sobre la rejilla de 12 columnas (como la referencia):
 * marca en 1–6 y columnas de enlaces desde la 7, en texto pequeño.
 */
export function Footer({ content, year = new Date().getFullYear() }: FooterProps) {
  const { brand, footer } = content

  return (
    <footer aria-label={footer.label} className="bg-surface px-gutter py-stack text-caption font-semibold">
      <div className="grid grid-cols-12 gap-gutter">
        <p className="col-span-12 text-lead md:col-span-6">{brand.name}</p>
        <div className="col-span-12 grid grid-cols-2 gap-gutter md:col-span-6 lg:grid-cols-4">
          {footer.columns.map((column) => (
            <section key={column.title} aria-label={column.title}>
              <h2 className="mb-2 text-ink-muted">{column.title}</h2>
              <ul className="flex flex-col gap-1">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}`}>
                    <SafeLink href={link.href} variant="plain">
                      {link.label}
                    </SafeLink>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="col-span-12 pt-stack text-ink-muted md:col-start-7 md:col-span-6">
          © {year} {brand.name}. {footer.rights}
        </p>
      </div>
    </footer>
  )
}
