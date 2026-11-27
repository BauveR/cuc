import { SECTION_IDS, anchor } from '@/content/site'

interface SkipLinkProps {
  readonly label: string
}

/** Primer elemento enfocable: salta la navegación hasta el <main> (WCAG 2.4.1). */
export function SkipLink({ label }: SkipLinkProps) {
  return (
    <a
      href={anchor(SECTION_IDS.main)}
      className="sr-only fixed top-2 left-gutter z-[60] rounded-full bg-ink px-5 py-3 text-paper focus:not-sr-only"
    >
      {label}
    </a>
  )
}
