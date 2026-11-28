import type { Ref } from 'react'

/**
 * Trazos de la intro (decorativos, color = currentColor).
 * Origen: ./source/cuc-04.svg (monograma) y cuc-03.svg (10 corazones
 * idénticos): se usa un solo corazón repetido → 6,7 KB → ~0,7 KB y cada uno
 * es un elemento propio para animarlo por separado.
 */
const LOGO_PATH =
  'M41,0c-3.865,.004-6.996,3.135-7,7v59c0,.828-.672,1.5-1.5,1.5s-1.5-.672-1.5-1.5v-17.5c0-8.561-6.939-15.5-15.5-15.5S0,39.939,0,48.5v42.5c0,3.865,3.135,7,7,7s7-3.135,7-7V48c0-.828,.672-1.5,1.5-1.5s1.5,.672,1.5,1.5v17.5c0,8.561,6.939,15.5,15.5,15.5s15.5-6.939,15.5-15.5V7c-.004-3.865-3.135-6.996-7-7Z'

const HEART_PATH =
  'M24.676,4.625v-.771h-.771v-1.542h-.771v-.771h-1.542V.771h-1.542V0h-3.087V.771h-1.542v.771h-1.542v.771h-.771v1.542h-.771v-1.542h-.771v-.771h-1.542V.771h-1.542V0h-3.087V.771h-1.542v.771h-1.542v.771h-.771v1.542H.771v1.542H0v3.087H.771v2.313h.771v1.542h1.542v1.542h1.542v1.542h1.542v1.542h1.542v1.546h1.546v1.542h1.542v1.542h1.542v.771h.771v-.771h1.542v-1.542h1.542v-1.542h1.546v-1.546h1.542v-1.542h1.542v-1.542h1.542v-1.542h1.542v-1.542h.771v-2.313h.771v-3.087h-.771v-.771Zm-.771,1.542v1.542h-.771v-2.313h-.771v-1.542h-1.542v-.771h-1.542v-.771h-1.542v.771h-1.546v-.771h1.546v-.771h1.542v.771h1.542v.771h1.542v.771h.771v1.542h.771v.771Z'

export const HEART_COUNT = 10

export const INTRO_PATHS = { logo: LOGO_PATH, heart: HEART_PATH } as const

interface IntroLogoProps {
  readonly ref?: Ref<SVGSVGElement>
}

/** Monograma (48 × 98). El alto lo fija el contenedor. */
export function IntroLogo({ ref }: IntroLogoProps) {
  return (
    <svg ref={ref} viewBox="0 0 48 98" fill="currentColor" className="block h-full w-auto" focusable="false">
      <path d={LOGO_PATH} />
    </svg>
  )
}

interface IntroHeartsProps {
  readonly ref?: Ref<HTMLUListElement>
}

/**
 * Fila de corazones de píxel. Alto de cada corazón = 1em (lo fija el
 * font-size del contenedor); separación 0,26em = 5,8 / 22,4 del original.
 */
export function IntroHearts({ ref }: IntroHeartsProps) {
  return (
    <ul ref={ref} className="flex gap-[0.26em]">
      {Array.from({ length: HEART_COUNT }, (_, i) => (
        <li key={i} className="h-[1em]" data-heart="">
          <svg viewBox="0 0 24.676 22.363" fill="currentColor" className="block h-full w-auto" focusable="false">
            <path d={HEART_PATH} />
          </svg>
        </li>
      ))}
    </ul>
  )
}
