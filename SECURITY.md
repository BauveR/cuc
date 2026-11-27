# Política de seguridad

## Versiones soportadas

Solo se da soporte a la versión desplegada desde `main`.

## Cómo reportar una vulnerabilidad

**No abras un issue público.** Usa el reporte privado de GitHub:
_Security → Report a vulnerability_ en este repositorio.

Incluye: descripción, pasos para reproducir, impacto estimado y, si es
posible, una propuesta de mitigación. Respondemos en un plazo de 72 h.

## Prácticas del proyecto

- Ningún secreto en el repositorio; `gitleaks` en pre-commit y en CI.
- Las variables `VITE_*` son públicas y nunca contienen secretos.
- CSP estricta y cabeceras de endurecimiento (ver `docs/01-setup.md`).
- Dependencias auditadas en CI y actualizadas vía Dependabot.
- GitHub Actions fijadas por SHA con permisos mínimos.
- Correcciones urgentes vía rama `hotfix/*` (ver `docs/00-git-workflow.md`).
