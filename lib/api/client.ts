export async function apiClient<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<{ success: boolean; message?: string; data?: T }> {
  const res = await fetch(`/api/backend${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.message || `Erreur API (${res.status})`)
  return json
}
