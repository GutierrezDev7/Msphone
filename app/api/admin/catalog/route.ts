import { cookies } from 'next/headers'
import { ADMIN_SESSION_COOKIE, isSameOriginRequest, verifyAdminSession } from '@/lib/admin-auth'
import {
  InvalidRequestBodyEncodingError,
  readRequestBodyWithinLimit,
} from '@/lib/request-body'
import { isStoreCatalog } from '@/lib/store-catalog'
import { getStoreCatalog, saveStoreCatalog } from '@/lib/store-catalog-server'

const NO_STORE_HEADERS = { 'Cache-Control': 'no-store' }
const MAX_CATALOG_SIZE = 1_000_000

async function isAuthenticated() {
  const cookieStore = await cookies()
  return verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ error: 'Sessão administrativa inválida.' }, { status: 401, headers: NO_STORE_HEADERS })
  }

  const catalog = await getStoreCatalog()
  return Response.json(catalog, { headers: NO_STORE_HEADERS })
}

export async function PUT(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: 'Requisição não autorizada.' }, { status: 403, headers: NO_STORE_HEADERS })
  }
  if (!(await isAuthenticated())) {
    return Response.json({ error: 'Sessão administrativa inválida.' }, { status: 401, headers: NO_STORE_HEADERS })
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return Response.json({ error: 'Formato de requisição inválido.' }, { status: 415, headers: NO_STORE_HEADERS })
  }

  let bodyText: string | null
  try {
    bodyText = await readRequestBodyWithinLimit(request, MAX_CATALOG_SIZE)
  } catch (error) {
    if (error instanceof InvalidRequestBodyEncodingError) {
      return Response.json({ error: 'O catálogo enviado contém texto inválido.' }, { status: 400, headers: NO_STORE_HEADERS })
    }
    throw error
  }
  if (bodyText === null) {
    return Response.json({ error: 'O catálogo excede o tamanho permitido.' }, { status: 413, headers: NO_STORE_HEADERS })
  }

  let catalog: unknown
  try {
    catalog = JSON.parse(bodyText) as unknown
  } catch (error) {
    if (error instanceof SyntaxError) {
      return Response.json({ error: 'O catálogo enviado não contém JSON válido.' }, { status: 400, headers: NO_STORE_HEADERS })
    }
    throw error
  }

  if (!isStoreCatalog(catalog)) {
    return Response.json(
      { error: 'Revise categorias, produtos, opções, preços e estoque antes de salvar.' },
      { status: 400, headers: NO_STORE_HEADERS },
    )
  }

  await saveStoreCatalog(catalog)
  return Response.json({ ok: true }, { headers: NO_STORE_HEADERS })
}
