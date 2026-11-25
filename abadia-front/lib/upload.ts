// Espejo de los límites de abadia-back/src/common/upload/upload-size.ts
// y del client_max_body_size 30m de nginx.
export const MAX_UPLOAD_BYTES = 30 * 1024 * 1024; // multimedia / banner
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // imágenes de habitación
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // avatar

export type UploadKind = "banner" | "image" | "avatar";

const LIMITS: Record<UploadKind, number> = {
  banner: MAX_UPLOAD_BYTES,
  image: MAX_IMAGE_BYTES,
  avatar: MAX_AVATAR_BYTES,
};

const LIMIT_LABELS: Record<UploadKind, string> = {
  banner: "el límite es 30 MB",
  image: "el límite por imagen es 10 MB",
  avatar: "el límite del avatar es 5 MB",
};

const ALLOWED_VIDEO_EXTENSIONS = ["mp4", "mov", "m4v"];
const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "avif"];
const VIDEO_EXTENSIONS = [...ALLOWED_VIDEO_EXTENSIONS, "webm", "ogg"];

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

function formatMb(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(1).replace(".", ",");
}

/**
 * Validación compartida por Multimedia, Configuración y el modal de Habitaciones.
 * Se ejecuta antes de enviar el archivo para mostrar un mensaje claro y no
 * depender del 413 HTML de nginx ni de un error opaco de Cloudinary.
 */
export function validateUploadFile(file: File, kind: UploadKind = "banner"): void {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const mime = file.type.toLowerCase();
  const isVideo = mime.startsWith("video/") || VIDEO_EXTENSIONS.includes(extension);
  const isImage = mime.startsWith("image/") || ALLOWED_IMAGE_EXTENSIONS.includes(extension);
  const max = LIMITS[kind];

  if (file.size > max) {
    throw new UploadValidationError(
      `El archivo pesa ${formatMb(file.size)} MB y ${LIMIT_LABELS[kind]}. Comprime el archivo y vuelve a intentarlo.`,
    );
  }

  if (isVideo && !ALLOWED_VIDEO_EXTENSIONS.includes(extension)) {
    throw new UploadValidationError(
      "Formato de video no admitido. Usa MP4, MOV o M4V para que se vea en el banner.",
    );
  }

  if (kind !== "banner" && (isVideo || !ALLOWED_IMAGE_EXTENSIONS.includes(extension))) {
    throw new UploadValidationError(
      "Solo se permiten imágenes JPG, PNG, WEBP, GIF o AVIF en esta sección.",
    );
  }

  if (!isVideo && !isImage) {
    throw new UploadValidationError(
      "Formato de archivo no admitido. Usa una imagen JPG, PNG, WEBP, GIF o AVIF, o un video MP4, MOV o M4V.",
    );
  }
}
