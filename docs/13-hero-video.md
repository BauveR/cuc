# 13 · Vídeo del hero con scroll (scrub)

> Commit: `feat(hero): add scroll-scrubbed hero video with responsive framing`

## Qué hace

Un vídeo en el hero que **avanza y retrocede al ritmo del scroll** (no se
reproduce solo). Ocupa el **80 % de alto** del hero (`80svh`) y se apoya
abajo: **margen inferior = laterales = gutter (15 px)**; el espacio libre
queda arriba, entre el header y el vídeo (`top: calc(20svh − gutter)`).
Medido en `svh` (viewport visible): en móvil la barra del navegador no lo tapa. Capas, de atrás adelante:

```
póster 3D (LCP) → vídeo (scrub) → canvas 3D → texto del hero (velo de papel)
```

Vive en el fondo fijo (`HeroBackdrop`): al hacer scroll, la siguiente sección
(opaca) sube y lo tapa, mientras el vídeo llega al final.

## Análisis del original (`IMG_2131 2.mov` → `media-src/hero.mov`)

> Sustituye al primer clip (`IMG_2131.mov`, 1708×914, 24 s, 35 MB), que se
> conserva en `media-src/hero-v1.mov` (ignorado). El nuevo es más corto y de
> mayor resolución: permite **más calidad con menos peso**.

| Dato | Valor | Decisión |
| ---- | ----- | -------- |
| Peso | 10 MB | Inviable en web → 2,3–4,2 MB por versión; test de presupuesto |
| Códec | HEVC (H.265) | No lo reproduce Firefox ni Chrome en muchos equipos → H.264 |
| Tamaño | 1920×1080, 6,7 s, 30 fps, 11,9 Mbps | 3 versiones a 24 fps (ver Responsive) |
| Color | SDR BT.709, rango completo (`yuvj420p`) | Rango limitado (`yuv420p`, tv): evita colores lavados |
| Audio | AAC | Eliminado (el scrub siempre va en silencio) |
| **Metadatos** | **GPS y fecha de grabación** | **Eliminados** (`-map_metadata -1`, bitexact) |

### Por qué el original no está en `public/`

Todo lo que hay en `public/` se copia al build y **se publica**, aunque esté
en `.gitignore`. El original vive en `media-src/` (ignorado; también `*.mov`)
y solo se versionan las versiones optimizadas y sin metadatos de `public/video/`.

## Codificación — `scripts/encode-hero-video.sh`

```bash
scripts/encode-hero-video.sh media-src/hero.mov 0.5   # 0.5 = foco horizontal del recorte vertical
```

- **H.264 High, yuv420p**: decodificación por hardware en todos los navegadores.
- **Keyframe cada 0,5 s** (`-g 12` a 24 fps, `-sc_threshold 0`): para mostrar un
  instante el decodificador parte del keyframe anterior; con GOP corto el seek
  es inmediato en ambos sentidos. Con el GOP por defecto (~250) el scrub da tirones.
- **faststart**: índice al principio → peticiones por rangos desde el inicio.
- Fotograma inicial en AVIF/WebP sin metadatos: primer paint y fallback.

### Pruebas de peso (primer clip, 24 s, horizontal 1280)

El contenido (oleaje: textura fina en todo el plano) es el peor caso para
comprimir. Con el clip actual (6,7 s) caben CRF mucho más bajos:
HD CRF 26/28/30 → 5,4/4,2/3,2 MB; vertical CRF 26/28/30 → 2,4/1,9/1,4 MB.

| CRF | GOP | fps | Ancho | Peso |
| --- | --- | --- | ----- | ---- |
| 26 | 6 | 30 | 1280 | 14,3 MB |
| 30 | 6 | 30 | 1280 | 8,3 MB |
| 32 | 12 | 24 | 1280 | 4,8 MB |
| 34 | 12 | 24 | 1280 | 3,6 MB |
| **36** | **12** | **24** | **1280** | **2,7 MB** ✓ |

Comparado a 2× de zoom frente al original: diferencia apenas visible en un
fondo detrás del 3D y del texto.

## Responsive

| Recuadro | Encuadre | Fichero | Peso |
| -------- | -------- | ------- | ---- |
| Ancho, pantalla ≥ 1280 px o ≥ 1024 px Retina | Nativo, 1920×1080 (CRF 28) | `hero-landscape-hd.*` | 4,2 MB |
| Ancho, pantallas medianas | 1280×720 (CRF 28) | `hero-landscape.*` | 2,3 MB |
| Más alto que ancho (móvil, tablet vertical) | Recorte 3:4, 810×1080 (CRF 26) | `hero-portrait.*` | 2,4 MB |

### Versión HD para escritorio

A 1440–1920 px el recuadro mide 1410–1890 px: la versión de 1280 se estiraba
×1,1–1,5 (más en Retina) y el oleaje se veía blando. La HD usa la resolución
nativa del original (no tiene sentido codificar por encima de ella).
Solo se sirve con `hdQuery` (pantalla grande o Retina); móvil y tablet siguen
con 2,5 MB. Presupuesto por versión en `video.config.ts` (test).

| Prueba (primer clip, 1708 px, 24 s) | Peso |
| ---------------- | ---- |
| H.264 CRF 30 / 32 / **34** | 9,4 / 7,3 / **5,6 MB** ✓ |
| AV1 (SVT) CRF 36 / 40 / 44 | 10,5 / 8,3 / 6,8 MB ✗ |

AV1 descartado: con un keyframe cada 0,5 s (necesario para el scrub) pierde
su ventaja y además requiere WebM + fallback y decodificación más costosa.

El recuadro mide (100vw − 30px) × 80svh: es vertical cuando el viewport
cumple `max-aspect-ratio: 4/5`. Se evalúa con `useMediaQuery`, así que
**al rotar el móvil cambia de encuadre** en caliente. `object-fit: cover`
ajusta el resto. `svh` evita saltos con la barra del navegador móvil.

## Scrub — `useVideoScrub`

- ScrollTrigger (`#inicio`, de `top top` a `bottom top`) solo guarda el
  progreso; Lenis ya suaviza el scroll.
- El seek se aplica en `gsap.ticker` (el mismo reloj que Lenis): uno por frame,
  nunca mientras el anterior sigue en curso (`video.seeking`) y solo si cambia
  más de 1/60 s → sin cola de seeks ni decodificador saturado.
- **iOS Safari** no descarga fotogramas de un vídeo nunca reproducido: se hace
  `play()` + `pause()` silenciado al cargar metadatos (permitido sin gesto).

## Rendimiento y accesibilidad

- El `<video>` se monta **tras el `load`** y en idle (`useAfterLoad`): no
  compite con el LCP (el póster sigue con `fetchpriority="high"`).
- **Sin vídeo** con `prefers-reduced-motion` o **ahorro de datos / 2G**
  (`prefersSaveData`): se queda el fotograma estático.
- Decorativo: dentro del fondo `aria-hidden`, `muted`, sin controles,
  `tabIndex=-1`, sin PiP ni cast. Sin audio → no requiere subtítulos.
- Texto del hero superpuesto con **velo de papel** (85 % + blur) en todos los
  tamaños: contraste AA garantizado sea cual sea el fotograma. La tarjeta se
  apoya dentro del recuadro, a un gutter de su borde inferior
  (`pb: 100lvh − 100svh + header + 2 × gutter`).

Medido en 390, 820, 1100, 1440 y 1920 px: márgenes izquierdo, derecho e
inferior de 15 px exactos, alto del 80 % y tarjeta a 15 px del borde del vídeo.

## Verificación (puppeteer, Chrome)

Clip actual: 390 y 820 → `portrait`; 1100 → `landscape`; 1440 y 1920 →
`landscape-hd`. Al 40 % de un viewport de scroll, `currentTime` = progreso del
hero × 6,71 s (p. ej. 390 px: (337 − 53) / 844 × 6,71 = 2,26 s ✓). Sin scroll
horizontal. Tablas siguientes: primer clip.

| Pantalla | Encuadre | Recuadro | Scrub (45 % de scroll → vuelta) |
| -------- | -------- | -------- | ------------------------------- |
| Móvil 390×844 | vertical | 362×675 (80 %) | 0 → 9,45 s → 0 |
| Tablet 820×1180 | vertical | 792×944 (80 %) | 0 → 9,85 s → 0 |
| Escritorio 1440×900 | horizontal | 1412×720 (80 %) | 0 → 9,53 s → 0 |

Selección por pantalla: 390@3× y 820@2× → `portrait`; 1024, 1100 y 1279 @1× →
`landscape`; 1100@2×, 1280, 1440 y 1920 → `landscape-hd`. El tiempo del vídeo
coincide con el esperado según el scroll (±0,01 s); seeks de 4–5 ms (p90 7 ms).

Sin scroll horizontal en ninguna. `dist/` no contiene el `.mov`. Ficheros
finales sin GPS, modelo ni fecha (comprobado con ffprobe y en los bytes).

## Seguridad

- CSP: `media-src 'self'` explícito (solo vídeo propio).
- Metadatos de ubicación eliminados del vídeo y de los fotogramas.

## Herramientas

- ffmpeg (Homebrew) solo en local, para generar los ficheros; no es
  dependencia del proyecto ni del CI.
