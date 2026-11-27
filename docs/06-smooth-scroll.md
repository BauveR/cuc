# 06 · Smooth scroll (Lenis + GSAP)

> Commit: `feat(scroll): add lenis smooth scroll synced with gsap scrolltrigger`

## Arquitectura

```
src/lib/gsap.ts                          Registro único de GSAP + ScrollTrigger + SplitText + useGSAP
src/hooks/usePrefersReducedMotion.ts     useSyncExternalStore sobre matchMedia (reacciona en caliente)
src/features/scroll/
  SmoothScrollProvider.tsx               ReactLenis root, o nada si reduced-motion
  LenisGsapBridge.tsx                    Reloj único gsap.ticker → Lenis → ScrollTrigger
  useSectionTriggers.ts                  ScrollTriggers desde [data-section]
src/components/RevealText/               Texto revelado por líneas (SplitText + máscara)
```

`SmoothScrollProvider` se monta en `AppProviders`, compartido por app y tests.

## Un único reloj

Siguiendo la integración recomendada en el README de Lenis:

```ts
lenis.on('scroll', ScrollTrigger.update)          // Lenis notifica a ScrollTrigger
gsap.ticker.add((time) => lenis.raf(time * 1000)) // GSAP da segundos, Lenis espera ms
gsap.ticker.lagSmoothing(0)                        // sin saltos tras pestaña inactiva
```

- `autoRaf: false`: Lenis no tiene su propio `requestAnimationFrame`; no hay
  dos bucles compitiendo (evita jitter entre scroll y animaciones).
- `syncTouch: false`: en táctil el scroll es **nativo** (inercia del sistema,
  mejor rendimiento y accesibilidad).
- `anchors: true`: los enlaces `#ancla` (SkipLink, menú) también se suavizan.
- Al desmontar se quita el tick y el listener y se **restaura** el
  `lagSmoothing(500, 33)` por defecto.

## Accesibilidad: prefers-reduced-motion

- Con `reduce`: **no se monta Lenis** (scroll nativo) y `RevealText` no divide
  ni anima: el texto aparece tal cual.
- La preferencia se escucha en caliente: si cambia, Lenis se desmonta/monta.
- Sin `window` (prerender futuro) se asume movimiento reducido: opción segura.

## useSectionTriggers(scope, options)

```tsx
const ref = useRef<HTMLElement>(null)
useSectionTriggers(ref, { onActive: (id) => setCurrent(id) })
// <section data-section="servicios">…
```

- Un ScrollTrigger por cada `[data-section]` dentro de `scope`.
- Escribe `data-active="true|false"` en el elemento (estilable con CSS,
  sin re-render de React) y llama a `onActive(id)` al activarse.
- Defaults: `start: 'top center'`, `end: 'bottom center'`.
- Todo se crea dentro de `useGSAP` → se destruye al desmontar.

## RevealText

```tsx
<RevealText as="h2" className="text-headline">{content.services.title}</RevealText>
```

- `SplitText.create` con `type: 'lines'`, `mask: 'lines'`: cada línea sube
  desde detrás de su máscara (`yPercent: 100`, `expo.out`, stagger 0.08).
- `autoSplit: true`: vuelve a dividir al redimensionar o al cargar fuentes,
  y re-sincroniza la animación devuelta en `onSplit`.
- `aria: 'auto'`: el contenedor recibe `aria-label` con el texto completo y
  las líneas se ocultan a lectores de pantalla (no se lee troceado).
- `once: true`: se revela una sola vez.
- Solo acepta `string` como hijo: el texto viene de `src/content/`.

## Tests

| Archivo | Cubre |
| ------- | ----- |
| `usePrefersReducedMotion.test.ts` | valor inicial, cambio en caliente, limpieza de listener |
| `SmoothScrollProvider.test.tsx` | root + opciones, `raf(time*1000)`, `ScrollTrigger.update`, `lagSmoothing(0)`, limpieza, reduced-motion |
| `useSectionTriggers.test.tsx` | un trigger por sección, `data-active`, `onActive`, `kill` al desmontar |
| `RevealText.test.tsx` | etiqueta semántica, SplitText con máscara, reduced-motion, nombre accesible + axe |

El mock de `matchMedia` ahora emite eventos `change` y se instala al cargar el
setup (ScrollTrigger lo consulta al importarse).

## Notas

- GSAP ≥ 3.13 incluye SplitText y el resto de plugins de forma gratuita.
- GSAP aplica estilos vía CSSOM (`element.style`), compatible con la CSP.
