/**
 * Compresse/redimensionne une image côté client (via canvas) avant
 * upload — réduit drastiquement le temps d'envoi et la charge serveur
 * pour les photos de téléphone souvent volumineuses (5-15 Mo), qui
 * peuvent contribuer à des timeouts (504) sur des connexions lentes ou
 * des serveurs avec un délai d'exécution court.
 */
export async function compressImage(
  file: File,
  { maxWidth = 1600, maxHeight = 1600, quality = 0.82 }: { maxWidth?: number; maxHeight?: number; quality?: number } = {},
): Promise<File> {
  // GIF (animé) : la compression via canvas casserait l'animation, on
  // laisse le fichier tel quel.
  if (file.type === "image/gif") return file

  try {
    const bitmap = await createImageBitmap(file)
    let { width, height } = bitmap

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      width = Math.round(width * ratio)
      height = Math.round(height * ratio)
    }

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return file

    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    )
    if (!blob) return file

    // Ne garde la version compressée que si elle est vraiment plus légère.
    if (blob.size >= file.size) return file

    const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg"
    return new File([blob], newName, { type: "image/jpeg" })
  } catch (error) {
    console.error("[compressImage] Échec de la compression, envoi du fichier original:", error)
    return file
  }
}
