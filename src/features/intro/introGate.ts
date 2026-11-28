/**
 * Coordinación de la intro con el resto de animaciones de entrada.
 * - shouldPlayIntro(): una vez por sesión y nunca con reduced-motion.
 * - holdReveal() retiene los reveals de texto (titular del hero) hasta que la
 *   cortinilla empieza a subir; sin intro, afterIntro() ejecuta al momento.
 */
const STORAGE_KEY = 'cuc:intro-seen'

let gate: Promise<void> | null = null // null = sin intro retenida

const readSeen = (): boolean => {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false // modo privado / almacenamiento bloqueado: se muestra
  }
}

export const markIntroSeen = (): void => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // sin almacenamiento: se repetirá en la próxima carga, sin más efecto
  }
}

export const shouldPlayIntro = (): boolean =>
  !readSeen() && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Retiene los reveals; devuelve la función que los libera. */
export const holdReveal = (): (() => void) => {
  let resolve: () => void = () => undefined
  gate = new Promise<void>((r) => {
    resolve = r
  })
  return () => {
    gate = null
    resolve()
  }
}

/** Ejecuta `fn` cuando la intro lo permita: síncrono si no hay intro retenida. */
export const afterIntro = (fn: () => void): void => {
  if (gate) void gate.then(fn)
  else fn()
}
