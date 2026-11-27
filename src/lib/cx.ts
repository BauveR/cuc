/** Une clases CSS ignorando valores falsy (alternativa mínima a clsx). */
export const cx = (...classes: ReadonlyArray<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ')
