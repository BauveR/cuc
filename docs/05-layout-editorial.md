# 05 · Layout editorial: header, menú, footer y proporciones

> Commit: `feat(layout): add editorial grid, header, menu overlay, footer and pexels imagery`

## Referencia y alcance

Se tomaron **solo las proporciones** de paulinpaulinpaulin.com (medidas en
navegador a 2056 px de ancho). No se copia marca, textos, imágenes ni
tipografía (usan CircularPro, comercial; aquí Inter, OFL).

| Medida de la referencia | Aplicación aquí |
| ----------------------- | --------------- |
| Rejilla de 12 columnas, margen y gutter de 15 px | `grid-cols-12 gap-gutter px-gutter`, `--spacing-gutter: 15px` |
| Header sticky de 53 px; marca en col. 1–6, navegación desde col. 7 | `Header` (`h-header`), nav e idiomas en `col-span-6` |
| Bloques texto 6 col. + imagen 6 col. | `SplitBlock` (Servicios, Sectores, Casos) |
| Fila de imágenes 8 + 4 col. | `MediaRow` (oficina + red) |
| Titular grande 48 px / 0.95 / −0.03em, peso 600 | `text-headline` (máx. 3rem), `text-display` (máx. 3.5rem) |
| Párrafo 18 px / 1.1, cuerpo 15 px / 1.5, pie 12 px | `text-lead`, `text-body`, `text-caption` |
| Footer en banda clara, enlaces desde col. 7 | `Footer` sobre `bg-surface` |

Se mantienen Lenis + GSAP (smooth scroll, RevealText, ScrollTriggers) y el hero 3D.

## Componentes (`src/components/layout/`)

| Componente | Responsabilidad |
| ---------- | --------------- |
| `SkipLink` | Primer foco; salta a `#contenido` (WCAG 2.4.1) |
| `Header` | Banner sticky; nav inline ≥ xl (1280 px), botón Menú por debajo |
| `NavLinks` | Lista de enlaces compartida por header y menú (DRY) |
| `MenuToggle` | "Menú / Cerrar" con `aria-expanded` y `aria-controls` |
| `MenuOverlay` | Diálogo modal a pantalla completa |
| `LangSwitch` | ES actual; CA/EN `aria-disabled` + "próximamente" |
| `Footer` | `contentinfo` con columnas nombradas, legales y redes |

Hooks: `useFocusTrap`, `useScrollLock`, `useAnchorNavigation`.

## Accesibilidad del menú

- Diálogo `role="dialog"` + `aria-modal`, con nombre.
- Al abrir, el foco va a "Cerrar"; Tab/Shift+Tab **ciclan dentro**; Escape
  cierra; al cerrar el foco **vuelve** al botón Menú.
- Con el menú abierto, la barra del header queda `inert` + `aria-hidden`
  (un único botón "Cerrar" en el árbol de accesibilidad — lo detectó un test).
- **Scroll bloqueado**: `lenis.stop()` + `overflow: hidden` (también sin Lenis).
- Al elegir un enlace: cierra y luego navega. Lenis ignora `scrollTo` mientras
  está parado, así que `useAnchorNavigation` desplaza tras cerrar y lleva el
  foco a la sección destino.
- Anclas con header sticky: `anchors: { offset: -53 }` en Lenis y
  `scroll-padding-top` en CSS (scroll nativo).

## Idiomas

ES/CA/EN visibles; CA y EN deshabilitados (`aria-disabled`, texto
"próximamente" para lectores, `lang` correcto). Sin enlaces a páginas vacías.
Al traducir: `src/content/ca|en/` + `available: true`.

## Imágenes (Pexels)

5 fotos, licencia Pexels — créditos y procesado en [`CREDITS.md`](./CREDITS.md).
`ResponsiveImage`: `<picture>` AVIF → WebP, 640/1280/1920 w, `sizes` según
columnas ocupadas, `loading="lazy"` (el LCP sigue siendo el póster),
`width`/`height` fijos (CLS 0). Servidas desde `/public/images` (CSP `img-src 'self'`).
**Metadatos EXIF/GPS eliminados** en la conversión. Alt descriptivos en
`src/content/es/media.ts`; un test exige que existan todos los archivos y alts.

## Enlaces y seguridad

- `SafeLink` gana la variante `plain` (subrayado solo en hover/foco) para
  listas de navegación; los enlaces en texto siguen subrayados (WCAG 1.4.1).
- `SafeLink` acepta `onClick` en el propio `<a>` (sin handlers en `<li>`).
- Redes con `rel="noopener noreferrer"`.

## Verificación visual (puppeteer, Chrome)

- Móvil 390 px (emulación real, DPR 2): sin scroll horizontal (`scrollWidth = 390`),
  header con Menú, menú abierto con foco en "Cerrar", footer en 2 columnas.
- Escritorio 1440 px: nav desde col. 7, bloques 6 + 6 y fila 8 + 4.
- Corregido en el paso 13: entre 1024 y 1199 px la nav inline desbordaba
  (idiomas hasta +49 px) → nav inline desde `xl`; por debajo, botón Menú.
- Corregido en el paso 13: `html { font-size: 15px }` encogía todos los `rem`
  un 6 % (header 50 px en vez de 53, gutter 14 en vez de 15). El tamaño de
  texto pasa a `body`; la raíz queda en el valor del navegador.
- Corregido: el contenedor de `Section` (`mx-auto` en flex columna) se
  encogía y centraba el intro → `w-full`.

## Pendiente

- **Páginas legales** (`/aviso-legal`, `/privacidad`, `/cookies`): obligatorias
  (LSSI-CE, RGPD) antes de publicar; hoy son enlaces sin página.
- URLs reales de LinkedIn/Instagram (hoy apuntan a la raíz de cada red).
- Medir Lighthouse cuando este paso y el 11 (3D diferido) estén juntos en `develop`.
