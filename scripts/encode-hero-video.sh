#!/usr/bin/env bash
# Genera los encuadres del vídeo del hero a partir del original (no versionado).
#   Uso: scripts/encode-hero-video.sh [media-src/hero.mov] [foco_x 0..1 = 0.5]
# Requiere ffmpeg, avifenc y cwebp. Salida: public/video/hero-{landscape,portrait}.{mp4,avif,webp}
#
# Decisiones (ver docs/13-hero-video.md):
# - H.264 High + yuv420p: decodificación por hardware en todos los navegadores.
# - 24 fps y keyframe cada 12 frames (0,5 s, sin cortes por escena): seek rápido
#   al hacer scrub sin disparar el peso (GOP 6 a 30 fps: 8,5 MB; ver docs).
# - CRF por encuadre para caber en el presupuesto (oleaje = textura difícil).
# - Rango limitado (tv): el iPhone graba yuvj (full) y algunos navegadores lo lavan.
# - Sin audio y SIN METADATOS (-map_metadata -1, bitexact): el original lleva GPS y fecha.
# - faststart: el índice va al principio → el navegador puede pedir rangos ya.
set -euo pipefail

SRC="${1:-media-src/hero.mov}"
FOCUS_X="${2:-0.5}"
OUT="public/video"
mkdir -p "$OUT"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

encode() { # $1 nombre, $2 filtro de vídeo, $3 CRF
  ffmpeg -hide_banner -loglevel error -y -i "$SRC" \
    -map 0:v:0 -an -sn -dn -map_metadata -1 -map_chapters -1 \
    -vf "fps=24,$2,scale=out_range=tv,format=yuv420p" \
    -c:v libx264 -profile:v high -preset slow -crf "$3" \
    -g 12 -keyint_min 12 -sc_threshold 0 \
    -movflags +faststart -fflags +bitexact -flags:v +bitexact \
    "$OUT/hero-$1.mp4"

  # Fotograma inicial (primer paint y fallback): sin metadatos.
  ffmpeg -hide_banner -loglevel error -y -i "$OUT/hero-$1.mp4" -frames:v 1 \
    -map_metadata -1 "$TMP/$1.png"
  avifenc --ignore-exif --ignore-xmp -q 55 "$TMP/$1.png" "$OUT/hero-$1.avif" >/dev/null
  cwebp -quiet -metadata none -q 72 "$TMP/$1.png" -o "$OUT/hero-$1.webp"
}

# Horizontal: proporción original, 1280 px de ancho.
encode landscape "scale=1280:-2:flags=lanczos" 36
# Vertical 3:4 a altura completa, centrado en FOCUS_X.
encode portrait "crop=trunc(ih*3/8)*2:trunc(ih/2)*2:(iw-trunc(ih*3/8)*2)*${FOCUS_X}:0" 34

ls -l "$OUT"
