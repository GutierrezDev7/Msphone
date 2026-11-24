export class InvalidRequestBodyEncodingError extends Error {}

export async function readRequestBodyWithinLimit(
  request: Request,
  maxBytes: number,
): Promise<string | null> {
  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > maxBytes) return null

  const reader = request.body?.getReader()
  if (!reader) return ''

  const chunks: Uint8Array[] = []
  let totalBytes = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    totalBytes += value.byteLength
    if (totalBytes > maxBytes) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }

  const body = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }

  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(body)
  } catch (error) {
    if (error instanceof TypeError) {
      throw new InvalidRequestBodyEncodingError('Request body is not valid UTF-8.', {
        cause: error,
      })
    }
    throw error
  }
}
