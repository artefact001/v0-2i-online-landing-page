import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function proxy(request: NextRequest, path: string[], method: string) {
  // Si la variable d'environnement n'est pas définie sur Vercel, on le dit
  // clairement au lieu de planter sur une URL "undefined/v1/...".
  if (!API_URL) {
    console.error('[api/backend] NEXT_PUBLIC_API_URL is not set in the environment')
    return NextResponse.json(
      { success: false, message: 'Configuration serveur manquante (NEXT_PUBLIC_API_URL)' },
      { status: 500 },
    )
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  let body: BodyInit | undefined

  if (method !== 'GET' && method !== 'DELETE') {
    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('multipart/form-data')) {
      body = await request.formData()
    } else {
      headers['Content-Type'] = 'application/json'
      body = await request.text()
    }
  }

  const targetUrl = `${API_URL}/api/v1/${path.join('/')}${request.nextUrl.search}`

  let res: Response
  try {
    res = await fetch(targetUrl, { method, headers, body })
  } catch (err) {
    // Le backend Laravel est injoignable (DNS, réseau, certificat, etc.)
    console.error('[api/backend] fetch failed:', targetUrl, err)
    return NextResponse.json(
      { success: false, message: 'Impossible de joindre le serveur API' },
      { status: 502 },
    )
  }

  const text = await res.text()

  let json: unknown = null
  if (text) {
    try {
      json = JSON.parse(text)
    } catch {
      // Laravel a renvoyé du HTML (page d'erreur 500 en mode debug, 404 par
      // défaut, etc.) au lieu de JSON. On ne plante pas dessus — on renvoie
      // un message exploitable avec le statut d'origine et un extrait brut
      // pour le débogage.
      console.error('[api/backend] non-JSON response from Laravel:', targetUrl, res.status, text.slice(0, 500))
      return NextResponse.json(
        {
          success: false,
          message: `Réponse invalide du serveur API (HTTP ${res.status})`,
          raw: text.slice(0, 500),
        },
        { status: res.status },
      )
    }
  }

  return NextResponse.json(json, { status: res.status })
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await params).path, 'GET')
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await params).path, 'POST')
}
export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await params).path, 'PUT')
}
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await params).path, 'PATCH')
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await params).path, 'DELETE')
}
