export async function apiClient<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<{ success: boolean; message?: string; data?: T }> {
  const isFormData = options.body instanceof FormData

  const res = await fetch(`/api/backend${path}`, {
    ...options,
    // Pour un upload de fichier (FormData), NE PAS fixer Content-Type
    // nous-mêmes : le navigateur doit le définir lui-même avec le bon
    // "boundary" multipart, sinon Laravel ne peut pas parser le fichier.
    headers: isFormData ? { ...options.headers } : { 'Content-Type': 'application/json', ...options.headers },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message || `Erreur API (${res.status})`)

  // Normalisation: certains contrôleurs Laravel (apiResource par défaut,
  // sans wrapper personnalisé) renvoient un tableau brut ou un objet
  // { data: [...] } au lieu de { success: true, data: [...] }. On
  // uniformise ici pour que TOUS les appelants puissent lire res.data en
  // toute sécurité, sans que chaque page ait à deviner la forme exacte.
  if (Array.isArray(json)) {
    return { success: true, data: json as unknown as T }
  }
  if (json && typeof json === 'object' && 'data' in json && !('success' in json)) {
    return { success: true, data: json.data as T, message: json.message }
  }
  return json
}

/**
 * Envoie un fichier (upload) via multipart/form-data, en passant par la
 * même route relais que apiClient (le token reste côté serveur).
 * Laravel a du mal à parser le multipart sur une requête PUT/PATCH native
 * (limitation PHP connue) — pour une mise à jour, on utilise donc POST
 * avec un champ _method=PUT en "method spoofing", convention Laravel
 * standard.
 */
export async function apiClientUpload<T = any>(
  path: string,
  formData: FormData,
  method: 'POST' | 'PUT' | 'PATCH' = 'POST',
): Promise<{ success: boolean; message?: string; data?: T }> {
  if (method !== 'POST') {
    formData.append('_method', method)
  }
  return apiClient<T>(path, { method: 'POST', body: formData })
}
