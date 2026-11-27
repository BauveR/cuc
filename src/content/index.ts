import { es } from './es/index.ts'
import { DEFAULT_LOCALE, type Locale, type SiteContent } from './types.ts'

const dictionaries: Readonly<Record<Locale, SiteContent>> = { es }

export const getContent = (locale: Locale = DEFAULT_LOCALE): SiteContent =>
  dictionaries[locale]

export * from './types.ts'
