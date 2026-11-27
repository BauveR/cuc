# [NOMBRE] · Web de marca

Sitio de marca de [NOMBRE]: servicios tecnológicos e integración de soluciones
para pymes en Barcelona. Contenido en ES, preparado para CA/EN.

## Requisitos

- Node 22 (`.nvmrc`)

## Uso

```bash
npm install
npm run dev
npm run check   # typecheck + lint + tests
npm run build
```

## Reglas del proyecto

- SOLID / KISS / DRY · un componente = una responsabilidad.
- Ningún archivo supera 100 líneas (lo aplica ESLint).
- Cada componente tiene su test (render, a11y básica, props/estados).
- Todo el texto vive en `src/content/`.
- Mobile-first, WCAG AA, respeta `prefers-reduced-motion`.
- **Nunca** secretos en código, docs o tests. Las variables `VITE_*` son públicas.
- Conventional Commits. Ramas `feat/*` → `develop` → `release/*` → `main`.
- Vulnerabilidades: ver [SECURITY.md](./SECURITY.md).

## Documentación

Ver [`docs/`](./docs): un documento por sección principal.

0. [Flujo de Git (ADR-001)](./docs/00-git-workflow.md)
1. [Setup base](./docs/01-setup.md)
3. [Testing](./docs/03-testing.md)
