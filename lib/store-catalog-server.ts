import 'server-only'

import { get, put } from '@vercel/blob'
import { DEFAULT_CATALOG, isStoreCatalog, type StoreCatalog } from '@/lib/store-catalog'
import {
  hasVercelBlobCredentials,
  STORE_CATALOG_BLOB_PATH,
} from '@/lib/vercel-blob-config'

export async function getStoreCatalog(): Promise<StoreCatalog> {
  if (!hasVercelBlobCredentials()) return DEFAULT_CATALOG

  const blob = await get(STORE_CATALOG_BLOB_PATH, {
    access: 'private',
    useCache: false,
  })
  if (!blob) return DEFAULT_CATALOG
  if (blob.statusCode !== 200) {
    throw new Error('The saved store catalog could not be read.')
  }

  const catalog = parseCatalogJson(await new Response(blob.stream).text())
  if (!isStoreCatalog(catalog)) {
    throw new Error('The saved store catalog is invalid.')
  }

  return catalog
}

function parseCatalogJson(value: string): unknown {
  try {
    return JSON.parse(value) as unknown
  } catch (error) {
    throw new Error('The saved store catalog is not valid JSON.', { cause: error })
  }
}

export async function saveStoreCatalog(catalog: StoreCatalog) {
  if (!hasVercelBlobCredentials()) {
    throw new Error('Vercel Blob is not configured.')
  }
  if (!isStoreCatalog(catalog)) throw new Error('The submitted store catalog is invalid.')

  await put(STORE_CATALOG_BLOB_PATH, JSON.stringify(catalog), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  })
}
