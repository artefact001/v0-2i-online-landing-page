import { apiClient } from '@/lib/api/client'

/**
 * Envoi direct des gros fichiers (vidéos, documents de leçon) vers l'API.
 *
 * Le relais /api/backend (hébergé sur Vercel) refuse les requêtes de plus de
 * ~4,5 Mo et coupe les envois longs (erreurs 413/504). Au-delà de ce seuil,
 * le navigateur envoie donc le fichier lui-même à l'API.
 *
 * Le token de session reste dans le cookie httpOnly : on demande d'abord un
 * « ticket » court (30 min, limité au dépôt d'un fichier temporaire) via le
 * relais, puis on envoie le fichier avec ce ticket. La leçon référence
 * ensuite le fichier par le champ video_ref / document_ref.
 */

// Sous ce seuil, le relais habituel suffit (chemin déjà éprouvé).
export const DIRECT_UPLOAD_THRESHOLD_BYTES = 4 * 1024 * 1024

export function needsDirectUpload(file: File | null | undefined): file is File {
  return !!file && file.size > DIRECT_UPLOAD_THRESHOLD_BYTES
}

export async function uploadFileDirect(
  file: File,
  kind: 'video' | 'document',
  onProgress?: (percent: number) => void,
): Promise<string> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    throw new Error("Configuration manquante : adresse de l'API introuvable.")
  }

  const ticketRes = await apiClient<{ ticket: string }>('/uploads/ticket', { method: 'POST' })
  const ticket = ticketRes.data?.ticket
  if (!ticket) {
    throw new Error("Impossible de préparer l'envoi du fichier. Réessayez.")
  }

  const form = new FormData()
  form.append('kind', kind)
  form.append('file', file)

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${apiUrl.replace(/\/$/, '')}/api/v1/uploads`)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.setRequestHeader('X-Upload-Ticket', ticket)
    xhr.timeout = 15 * 60 * 1000 // 15 min : large marge pour une vidéo sur réseau mobile

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      let json: any = null
      try {
        json = JSON.parse(xhr.responseText)
      } catch {
        /* réponse non JSON (ex. page d'erreur du serveur) */
      }

      if (xhr.status >= 200 && xhr.status < 300 && json?.data?.ref) {
        resolve(json.data.ref as string)
        return
      }

      if (xhr.status === 413) {
        reject(new Error('Fichier trop volumineux pour le serveur. Réduisez sa taille ou contactez l\'administrateur.'))
        return
      }

      reject(new Error(json?.message || `Échec de l'envoi du fichier (code ${xhr.status}).`))
    }

    xhr.onerror = () => reject(new Error("Échec de l'envoi du fichier : vérifiez votre connexion et réessayez."))
    xhr.ontimeout = () => reject(new Error("L'envoi a pris trop de temps. Vérifiez votre connexion et réessayez."))

    xhr.send(form)
  })
}
