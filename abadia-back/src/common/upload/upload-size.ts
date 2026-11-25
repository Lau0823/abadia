/**
 * Límites de peso de todos los endpoints que reciben archivos.
 * nginx permite hasta 30 MB en el vhost de Abadía; cada endpoint aplica
 * además su propio límite aquí, así que mantener esta tabla es suficiente
 * para revisar el peso en un solo lugar.
 */
export const UPLOAD_LIMITS = {
  settings: {
    maxSize: 30 * 1024 * 1024,
    message: 'El archivo supera el límite de 30 MB',
  },
  habitaciones: {
    maxSize: 10 * 1024 * 1024,
    message: 'El archivo supera el límite de 10 MB',
  },
  avatar: {
    maxSize: 5 * 1024 * 1024,
    message: 'El archivo supera el límite de 5 MB',
  },
} as const;
