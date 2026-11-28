import { useEffect, type RefObject } from 'react'
import { ScrollTrigger, gsap } from '@/lib/gsap'

/** Por debajo de ~medio frame (30 fps) no merece la pena otro seek. */
const MIN_STEP_S = 1 / 60

/**
 * Sincroniza currentTime del vídeo con el scroll mientras `trigger` cruza
 * el viewport (de "top top" a "bottom top": el hero saliendo de pantalla).
 * - ScrollTrigger solo guarda el progreso objetivo (Lenis ya suaviza).
 * - El seek se aplica en el gsap.ticker (el mismo reloj que Lenis), uno por
 *   frame y nunca mientras el anterior sigue en curso (video.seeking):
 *   así no se encolan seeks y el decodificador no se satura.
 */
export const useVideoScrub = (
  videoRef: RefObject<HTMLVideoElement | null>,
  triggerId: string,
  enabled: boolean,
): void => {
  useEffect(() => {
    const video = videoRef.current
    const trigger = document.getElementById(triggerId)
    if (!enabled || !video || !trigger) return

    let target = 0
    const st = ScrollTrigger.create({
      trigger,
      start: 'top top',
      end: 'bottom top',
      onUpdate: ({ progress }) => {
        target = progress
      },
    })
    target = st.progress

    const tick = () => {
      const { duration } = video
      if (!Number.isFinite(duration) || duration <= 0 || video.seeking) return
      const time = target * duration
      if (Math.abs(video.currentTime - time) >= MIN_STEP_S) video.currentTime = time
    }
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      st.kill()
    }
  }, [videoRef, triggerId, enabled])
}
