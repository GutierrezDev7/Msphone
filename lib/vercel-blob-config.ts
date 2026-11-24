import 'server-only'

export const STORE_CATALOG_BLOB_PATH = 'store/catalog.json'

export function hasVercelBlobCredentials() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN),
  )
}
