# 00 · Flujo de Git (ADR-001)

> Commit: `chore: add git flow workflow with ci, hooks and release automation`

| Estado | Fecha | Decisor |
| ------ | ----- | ------- |
| Aceptada | 2026-11-27 | Responsable del proyecto |

## Contexto

Proyecto frontend de marca desarrollado por pasos/secciones. Se necesita un
entorno de integración (preview) separado de producción y un historial
trazable y auditable, con barreras automáticas contra secretos y regresiones.

## Decisión

**Git Flow simplificado** con `main` (producción) y `develop` (integración).

| Rama | Sale de | Entra en | Merge | Uso |
| ---- | ------- | -------- | ----- | --- |
| `main` | — | — | — | Producción. Cada release lleva tag `vX.Y.Z` |
| `develop` | `main` | — | — | Integración / preview. Rama por defecto en GitHub |
| `feat/*` `fix/*` `chore/*` `docs/*` `sec/*` | `develop` | `develop` | Squash | Una por paso o sección |
| `release/x.y.z` | `develop` | `main` (+ back-merge a `develop`) | Merge commit | Congelar versión, ajustes finales |
| `hotfix/*` | `main` | `main` + `develop` | Merge commit | Urgencias en producción (prioridad: seguridad) |

**Nombres de rama**: `tipo/descripcion-en-kebab` (`feat/hero-section`).
**Commits**: Conventional Commits, con el tipo extra `sec` para cambios de seguridad.

## Alternativas descartadas

- **GitHub Flow (solo `main`)**: más simple, pero sin entorno de integración
  previo a producción, que es un requisito de este proyecto.
- **Git Flow completo**: `release/*` obligatorio en cada versión es burocracia
  innecesaria para un sitio sin versiones en paralelo.

## Consecuencias

- (+) `main` siempre refleja producción; `develop` permite validar en preview.
- (+) Squash en `develop` = un commit por sección, fácil de revertir.
- (−) Hay que hacer back-merge `main → develop` tras cada release/hotfix.

## Barreras automáticas

| Momento | Herramienta | Efecto |
| ------- | ----------- | ------ |
| pre-commit | gitleaks (si instalado) | Bloquea secretos en lo staged |
| pre-commit | lint-staged + ESLint | Lint de archivos modificados, 0 warnings |
| commit-msg | commitlint | Exige Conventional Commits |
| pre-push | husky | Bloquea push directo a `main`/`develop`; ejecuta `npm run check` |
| PR / push | GitHub Actions `ci.yml` | typecheck, lint, test, build, `npm audit`, gitleaks (historial completo) |
| push a `main` | `release.yml` (release-please) | PR de release con CHANGELOG + SemVer → tag |
| Semanal | Dependabot → `develop` | Actualizaciones npm y Actions |

### Endurecimiento de la CI

- Actions **fijadas por SHA** (no por tag mutable) + comentario de versión.
- `permissions: contents: read` global; escritura solo en el job de release.
- `persist-credentials: false` en checkout.
- `npm ci --ignore-scripts`: lockfile estricto y sin scripts `postinstall` de terceros.

## Configuración en GitHub (tras el primer push)

1. Rama por defecto: `develop`.
2. Rulesets para `main` y `develop`: PR obligatorio, CI verde (`quality`,
   `secrets`), historial lineal en `develop`, sin force-push ni borrado.
3. `main`: commits firmados y revisión de CODEOWNERS.
4. Settings → Code security: Secret scanning + Push protection, Dependabot
   alerts y Private vulnerability reporting (ver `SECURITY.md`).

## Operativa

```bash
# Nueva sección
git switch develop && git pull
git switch -c feat/layout-base
# ... commits ...
git push -u origin feat/layout-base   # → PR a develop (squash)

# Release
git switch -c release/0.2.0 develop   # → PR a main (merge commit)
git switch develop && git merge main  # back-merge tras publicar
```

**Bootstrap**: el primer push de `main` y `develop` se hace con
`git push --no-verify` (único caso permitido), antes de activar los rulesets.

## Herramientas locales recomendadas

```bash
brew install gitleaks
```
