export const MAX_UPLOAD_BYTES = 30 * 1024 * 1024; // 30 MB (mismo límite que nginx y el backend)

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
 * Validación compartida entre el panel de Multimedia y el de Configuración.
 * Se ejecuta antes de enviar el archivo para que el usuario vea un mensaje claro
 * y no dependa del 413 HTML de nginx ni de un error opaco de Cloudinary.
 */
export function validateUploadFile(file: File): void {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const mime = file.type.toLowerCase();
  const isVideo = mime.startsWith("video/") || VIDEO_EXTENSIONS.includes(extension);
  const isImage = mime.startsWith("image/") || ALLOWED_IMAGE_EXTENSIONS.includes(extension);

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadValidationError(
      `El archivo pesa ${formatMb(file.size)} MB y el límite es 30 MB. Comprime el archivo y vuelve a intentarlo.`,
    );
  }

  if (isVideo && !ALLOWED_VIDEO_EXTENSIONS.includes(extension)) {
    throw new UploadValidationError(
      "Formato de video no admitido. Usa MP4, MOV o M4V para que se vea en el banner.",
    );
  }

  if (!isVideo && !isImage) {
    throw new UploadValidationError(
      "Formato de archivo no admitido. Usa una imagen JPG, PNG, WEBP, GIF o AVIF, o un video MP4, MOV o M4V.",
    );
  }
}
