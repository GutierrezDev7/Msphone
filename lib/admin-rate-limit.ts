import 'server-only'

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const MAX_FAILED_ATTEMPTS = 5
const MAX_TRACKED_CLIENTS = 10_000

type FailedAttempts = {
  count: number
  expiresAt: number
}

const failedAttempts = new Map<string, FailedAttempts>()

function removeExpiredAttempts(now: number) {
  for (const [ipHash, attempts] of failedAttempts) {
    if (attempts.expiresAt <= now) failedAttempts.delete(ipHash)
  }
}

export function isAdminLoginRateLimited(ipHash: string) {
  const now = Date.now()
  removeExpiredAttempts(now)
  return (failedAttempts.get(ipHash)?.count ?? 0) >= MAX_FAILED_ATTEMPTS
}

export function recordFailedAdminLogin(ipHash: string) {
  const now = Date.now()
  removeExpiredAttempts(now)
  const current = failedAttempts.get(ipHash)

  failedAttempts.set(
    ipHash,
    current && current.expiresAt > now
      ? { ...current, count: current.count + 1 }
      : { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS },
  )

  while (failedAttempts.size > MAX_TRACKED_CLIENTS) {
    const oldestIpHash = failedAttempts.keys().next().value
    if (!oldestIpHash) break
    failedAttempts.delete(oldestIpHash)
  }
}

export function clearAdminLoginAttempts(ipHash: string) {
  failedAttempts.delete(ipHash)
}
