import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL!

async function proxy(request: NextRequest, path: string[], method: string) {
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

  const res = await fetch(`${API_URL}/v1/${path.join('/')}${request.nextUrl.search}`, {
    method,
    headers,
    body,
  })

  const text = await res.text()
  const json = text ? JSON.parse(text) : null

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
