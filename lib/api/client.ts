export async function apiClient<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<{ success: boolean; message?: string; data?: T }> {
  const res = await fetch(`/api/backend${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
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
