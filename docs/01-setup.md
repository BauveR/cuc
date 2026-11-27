# 01 · Setup base del proyecto

> Commit: `chore: scaffold vite react ts strict with tailwind v4, vitest and security baseline`

## Objetivo

Dejar una base reproducible, tipada al máximo y segura por defecto sobre la que
construir el sitio de marca, sin código de features todavía.

## Stack

| Capa        | Herramienta                                         |
| ----------- | --------------------------------------------------- |
| Build/dev   | Vite 8 + `@vitejs/plugin-react`                     |
| Lenguaje    | TypeScript (strict + flags extra)                   |
| Estilos     | Tailwind v4 vía `@tailwindcss/vite`, tokens `@theme` |
| Tests       | Vitest + Testing Library + jsdom + `vitest-axe`     |
| Lint        | ESLint 9 + typescript-eslint strict + jsx-a11y      |

> R3F/drei, GSAP y Lenis se instalarán en el paso que los use (YAGNI).
> ESLint queda en 9 porque `eslint-plugin-jsx-a11y` aún no soporta ESLint 10.

## Estructura

```
config/              Código de build (Node): cabeceras, plugins de Vite
src/content/         ÚNICA fuente de texto. types.ts = contrato i18n
  es/                Idioma por defecto (ca/en se añadirán aquí)
src/styles/          CSS global + design tokens
src/test/            Setup de Vitest y tipos de matchers
docs/                Documentación por sección/commit
```

## Decisiones clave

- **Contenido tipado (`SiteContent`)**: cada idioma debe cumplir el contrato;
  una traducción incompleta rompe `tsc`. Un test verifica que no hay textos vacíos.
- **`index.html` sin texto**: `config/html-meta-plugin.ts` inyecta `lang`,
  `title` y `description` desde `src/content`, **escapando HTML**.
- **Regla de 100 líneas** aplicada por ESLint (`max-lines`), no por disciplina.
- **TS estricto extra**: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
  `noPropertyAccessFromIndexSignature`, etc.
- **A11y**: `jsx-a11y` en lint + `axe` en tests; `:focus-visible` global;
  `prefers-reduced-motion` neutraliza animaciones/transiciones CSS.

## Seguridad

| Medida | Dónde |
| ------ | ----- |
| CSP estricta en prod (`script-src 'self'`, sin inline/eval) | `config/security-headers.ts` |
| `frame-ancestors 'none'`, `X-Frame-Options: DENY` (clickjacking) | idem |
| `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP | idem |
| Sin sourcemaps en producción | `vite.config.ts` |
| Prohibidos `eval`, `new Function`, `innerHTML`, `dangerouslySetInnerHTML` | `eslint.config.js` |
| `.env*` ignorados salvo `.env.example` (solo nombres) | `.gitignore` |
| `VITE_*` documentadas como **públicas** | `.env.example`, `src/vite-env.d.ts` |
| `save-exact`, `engine-strict`, `"private": true` (no publicar a npm) | `.npmrc`, `package.json` |

**Producción**: las cabeceras de `securityHeaders({ dev: false })` deben
replicarse en el hosting (Netlify `_headers`, Vercel `vercel.json`, Nginx…)
cuando se elija proveedor. La CSP de dev relaja `script-src`/`connect-src`
solo para React Refresh y HMR.

## Versión de Node

`.nvmrc` fija una versión **exacta** (22.23.5): la CI (`node-version-file`) y
el entorno local usan la misma. `engines` marca el mínimo (`>=22.22.2`, exigido
por jsdom ≥ 30 y lint-staged ≥ 17) y `engine-strict` impide instalar con una
versión inferior. Actualizar Node 22 a menudo: sus releases incluyen parches
de seguridad.

## Comandos

```bash
npm install
npm run dev         # servidor local
npm run check       # typecheck + lint + tests
npm run build       # build de producción en dist/
npm run audit:deps  # auditoría de dependencias de runtime
```

## Tests incluidos

- `src/App.test.tsx` – render, landmark `main`, h1 y axe sin violaciones.
- `src/content/content.test.ts` – idioma por defecto y textos no vacíos.
- `config/html-meta-plugin.test.ts` – escape HTML e inyección de meta.
- `config/security-headers.test.ts` – CSP de prod sin inline/eval, anti-framing.
