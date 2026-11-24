import { cookies } from 'next/headers'
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSession,
  getAdminClientHash,
  getAdminSetupStatus,
  isSameOriginRequest,
  verifyAdminCredentials,
} from '@/lib/admin-auth'
import {
  clearAdminLoginAttempts,
  isAdminLoginRateLimited,
  recordFailedAdminLogin,
} from '@/lib/admin-rate-limit'
import {
  InvalidRequestBodyEncodingError,
  readRequestBodyWithinLimit,
} from '@/lib/request-body'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getClientIp(request: Request) {
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: 'Requisição não autorizada.' }, { status: 403 })
  }

  const setup = getAdminSetupStatus()
  if (!setup.ready) {
    return Response.json(
      { error: 'O acesso administrativo ainda não foi configurado.', missing: setup.missing },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Formato de requisição inválido.' }, { status: 415 })
  }

  let bodyText: string | null
  try {
    bodyText = await readRequestBodyWithinLimit(request, 4096)
  } catch (error) {
    if (error instanceof InvalidRequestBodyEncodingError) {
      return Response.json({ error: 'Dados de acesso inválidos.' }, { status: 400 })
    }
    throw error
  }
  if (bodyText === null) {
    return Response.json({ error: 'Requisição muito grande.' }, { status: 413 })
  }

  let body: unknown
  try {
    body = JSON.parse(bodyText) as unknown
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: 'Dados de acesso inválidos.' }, { status: 400 })
    }
    throw error
  }

  if (
    !isRecord(body) ||
    typeof body.username !== 'string' ||
    typeof body.password !== 'string' ||
    body.username.length > 120 ||
    body.password.length > 256
  ) {
    return Response.json({ error: 'Informe usuário e senha.' }, { status: 400 })
  }

  const ipHash = getAdminClientHash(getClientIp(request))
  if (isAdminLoginRateLimited(ipHash)) {
    return Response.json(
      { error: 'Muitas tentativas. Aguarde 15 minutos e tente novamente.' },
      { status: 429, headers: { 'Retry-After': '900', 'Cache-Control': 'no-store' } },
    )
  }

  if (!verifyAdminCredentials(body.username, body.password)) {
    recordFailedAdminLogin(ipHash)
    return Response.json({ error: 'Usuário ou senha incorretos.' }, { status: 401 })
  }

  clearAdminLoginAttempts(ipHash)
  const cookieStore = await cookies()
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSession(body.username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE,
  })

  return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function DELETE(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: 'Requisição não autorizada.' }, { status: 403 })
  }

  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_SESSION_COOKIE)
  return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
}
