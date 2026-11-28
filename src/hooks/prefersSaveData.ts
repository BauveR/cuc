interface NetworkInformationLike {
  readonly saveData?: boolean
  readonly effectiveType?: string
}

/**
 * true si conviene no descargar medios pesados: "ahorro de datos" activo
 * o conexión 2G (Network Information API; sin soporte → false).
 * Se lee una vez por render: no merece suscripción.
 */
export const prefersSaveData = (): boolean => {
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection
  if (!connection) return false
  return connection.saveData === true || /(^|-)2g$/.test(connection.effectiveType ?? '')
}
