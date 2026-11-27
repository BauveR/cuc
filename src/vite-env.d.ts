/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL pública del sitio (canonical/OG). Pública: nunca un secreto. */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
