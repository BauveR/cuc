/**
 * Punto único de registro de GSAP y plugins (idempotente).
 * Importar SIEMPRE desde aquí, nunca 'gsap' directamente en componentes.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

export { gsap, ScrollTrigger, SplitText, useGSAP }
