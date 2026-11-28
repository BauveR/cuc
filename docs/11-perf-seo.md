# 11 · Rendimiento y SEO

> Commit: `perf(seo): defer 3d until interaction, add seo tags, json-ld, sitemap and self-hosted font`

## Resultado Lighthouse 13.6 (móvil, `vite preview`, CSP de producción)

| Categoría | Antes | Después |
| --------- | ----: | ------: |
| Performance | 71 | **100** |
| Accessibility | 100 | **100** |
| Best Practices | 100 | **100** |
| SEO | 91 | **100** |

| Métrica | Antes | Después |
| ------- | ----: | ------: |
| FCP / LCP | 1,3 s / 1,3 s | 1,3 s / 1,3 s |
| **Total Blocking Time** | **2.220 ms** | **40 ms** |
| Speed Index | 3,3 s | 1,3 s |
| CLS | 0 | 0 |

Dos ejecuciones idénticas tras el cambio. Medido con Chrome headless local;
en dispositivos reales los valores varían, el objetivo (≥ 90) queda holgado.

## Causa del TBT y solución

En la emulación móvil detect-gpu daba un tier válido y la **carga inicial**
descargaba three (281 KB gz), lo parseaba y compilaba shaders: ~2 s de hilo
principal bloqueado (CPU ×4 simulada).

**Decisión**: el 3D se carga tras la **primera interacción** (`scroll`,
`wheel`, `touchstart`, `pointerdown`, `keydown`) — `useFirstInteraction`.
El modelo lo mueve el scroll, así que antes no aporta nada y el póster ya
muestra su estado inicial. También se difiere detect-gpu. No es un truco
para Lighthouse: beneficia a usuarios reales (INP, batería, datos móviles).
Verificado en Chrome: sin three antes del scroll; tras él, canvas + fundido.

## SEO

| Elemento | Implementación |
| -------- | -------------- |
| Title / description | Ya existían, desde `src/content` |
| Canonical, robots meta | `config/seo-tags.ts` |
| Open Graph + Twitter Card | Imagen `public/og/og-image.jpg` 1200×630, alt desde contenido |
| JSON-LD `LocalBusiness` | Nombre, descripción, URL, email, dirección (Barcelona, ES), área servida y catálogo de servicios. **Solo datos reales del contenido**: sin teléfono, calle ni reseñas inventadas |
| `sitemap.xml`, `robots.txt` | Emitidos en el build (`config/seo-files.ts`) |
| URL del sitio | `VITE_SITE_URL` (pública, no es secreto), validada por `config/site-url.ts` |

### Seguridad en SEO

- `resolveSiteUrl`: solo `https`, sin credenciales, query ni hash (tests).
- Todos los valores de meta tags se **escapan** (test con `"><script>`).
- JSON-LD escapa `<`, `>` y `&` como `\uXXXX`: un texto con `</script>` no
  puede cerrar la etiqueta (XSS). Es un *data block*: la CSP no lo bloquea.
- **Sin `VITE_SITE_URL`** (p. ej. build de CI): `robots.txt` → `Disallow: /`
  y meta `noindex` + aviso en el build. Un despliegue mal configurado nunca
  se indexa con `example.com` como canonical.

## Fuentes self-hosted

`@fontsource-variable/inter` (OFL) con `@font-face` propio en
`src/styles/fonts.css`: **solo latin + latin-ext** (ES/CA/EN); no se publican
cirílico, griego ni vietnamita. `font-display: swap`. El plugin SEO localiza
el `.woff2` latin con hash en el bundle y añade
`<link rel="preload" as="font" crossorigin>`. CSP `font-src 'self'` intacta.

## Imágenes responsive

Póster en 640 / 1280 / 1920 w, AVIF + WebP (1,8–11 KB), `srcset` +
`sizes="100vw"` y `<link rel="preload" imagesrcset>` generado desde
`POSTER` (fuente única en `scene.config.ts`). `width`/`height` fijos → CLS 0.

## Bundle (gzip)

| Recurso | gzip | Carga |
| ------- | ---: | ----- |
| `index` JS | 59,9 KB | inicial |
| `vendor-react` | 65,9 KB | inicial |
| CSS | 4,3 KB | inicial |
| Inter latin (woff2) | 47,1 KB | inicial (preload) |
| Póster 1280 AVIF | 3,6 KB | inicial (LCP) |
| **Total carga inicial** | **≈ 183 KB** | |
| `detect-gpu` | 3,1 KB | tras interacción |
| `HeroCanvas` | 2,4 KB | tras interacción |
| `vendor-three` | 280,9 KB | tras interacción |
| Inter latin-ext | 83,1 KB | solo si hay caracteres de ese rango |

## Pendiente / descartado

- **Sourcemaps desactivados** (Lighthouse lo marca, sin afectar a la nota):
  decisión de seguridad del paso 01, no se publica el código fuente.
- `llms.txt` y `ard-schema` (categoría experimental *agentic browsing*):
  fuera de alcance; evaluar más adelante.
- Sustituir `og-image.jpg` y póster por arte de marca definitivo.
- Configurar `VITE_SITE_URL` en el hosting antes de publicar.
