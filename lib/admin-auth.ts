import 'server-only'

import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { hasVercelBlobCredentials } from '@/lib/vercel-blob-config'

const SESSION_TTL_SECONDS = 60 * 60 * 8
export const ADMIN_SESSION_COOKIE = 'ms_admin_session'

export function getAdminSetupStatus() {
  const missing: string[] = []

  if (!hasVercelBlobCredentials()) {
    missing.push('Vercel Blob (BLOB_READ_WRITE_TOKEN ou conexão OIDC)')
  }
  if (!process.env.ADMIN_USERNAME) missing.push('ADMIN_USERNAME')
  if (!process.env.ADMIN_PASSWORD || [...process.env.ADMIN_PASSWORD].length < 16) {
    missing.push('ADMIN_PASSWORD (mínimo 16 caracteres)')
  }
  if (!process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) {
    missing.push('ADMIN_SESSION_SECRET (mínimo 32 caracteres)')
  }

  return { ready: missing.length === 0, missing }
}

function constantTimeEqual(left: string, right: string) {
  const leftHash = createHash('sha256').update(left).digest()
  const rightHash = createHash('sha256').update(right).digest()
  return timingSafeEqual(leftHash, rightHash)
}

export function verifyAdminCredentials(username: string, password: string) {
  const storedUsername = process.env.ADMIN_USERNAME ?? ''
  const storedPassword = process.env.ADMIN_PASSWORD ?? ''
  const usernameMatches = constantTimeEqual(username, storedUsername)
  const passwordMatches = constantTimeEqual(password, storedPassword)

  return getAdminSetupStatus().ready && usernameMatches && passwordMatches
}

function signSession(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

function getCredentialVersion(username: string, password: string, secret: string) {
  return createHmac('sha256', secret).update(`${username}:${password}`).digest('base64url')
}

export function createAdminSession(username: string) {
  const secret = process.env.ADMIN_SESSION_SECRET
  const password = process.env.ADMIN_PASSWORD
  if (!secret || secret.length < 32 || !password) {
    throw new Error('Admin session secrets are not configured.')
  }

  const payload = Buffer.from(
    JSON.stringify({
      username,
      expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
      nonce: randomBytes(16).toString('base64url'),
      credentialVersion: getCredentialVersion(username, password, secret),
    }),
  ).toString('base64url')

  return `${payload}.${signSession(payload, secret)}`
}

export function verifyAdminSession(token: string | undefined) {
  const secret = process.env.ADMIN_SESSION_SECRET
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD
  if (
    !token ||
    !secret ||
    secret.length < 32 ||
    !username ||
    !password ||
    [...password].length < 16 ||
    token.length > 1024
  ) {
    return false
  }

  const [payload, signature, extra] = token.split('.')
  if (!payload || !signature || extra !== undefined) return false
  if (!constantTimeEqual(signature, signSession(payload, secret))) return false

  let decoded: unknown
  try {
    decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as unknown
  } catch {
    return false
  }

  if (typeof decoded !== 'object' || decoded === null || Array.isArray(decoded)) return false
  const session = decoded as Record<string, unknown>

  return (
    session.username === username &&
    typeof session.expiresAt === 'number' &&
    Number.isSafeInteger(session.expiresAt) &&
    session.expiresAt > Date.now() &&
    typeof session.nonce === 'string' &&
    typeof session.credentialVersion === 'string' &&
    constantTimeEqual(
      session.credentialVersion,
      getCredentialVersion(username, password, secret),
    )
  )
}

export function getAdminClientHash(ipAddress: string) {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 32) throw new Error('ADMIN_SESSION_SECRET is not configured.')
  return createHmac('sha256', secret).update(ipAddress).digest('hex')
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return false

  try {
    return new URL(origin).origin === new URL(request.url).origin
  } catch {
    return false
  }
}

export const ADMIN_SESSION_MAX_AGE = SESSION_TTL_SECONDS
