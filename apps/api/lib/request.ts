import { URL } from 'node:url'

import { sendError, type ApiRequest, type ApiResponse, type JsonValue } from './http.js'

export function getRequestUrl(req: ApiRequest) {
  const host = req.headers.host ?? 'localhost'
  const protocol = 'https'

  return new URL(req.url ?? '/', `${protocol}://${host}`)
}

export function getQueryParam(req: ApiRequest, key: string) {
  return getRequestUrl(req).searchParams.get(key) ?? undefined
}

export function getNumberQueryParam(
  req: ApiRequest,
  key: string,
  fallback: number,
) {
  const rawValue = getQueryParam(req, key)

  if (!rawValue) {
    return fallback
  }

  const parsedValue = Number(rawValue)

  return Number.isFinite(parsedValue) ? parsedValue : fallback
}

export function requireMethod(
  req: ApiRequest,
  res: ApiResponse,
  allowedMethod: string,
) {
  if ((req.method ?? 'GET').toUpperCase() === allowedMethod.toUpperCase()) {
    return true
  }

  res.setHeader('Allow', allowedMethod.toUpperCase())
  sendError(res, 405, `Method ${req.method ?? 'UNKNOWN'} not allowed`)
  return false
}

export async function readJsonBody<T extends JsonValue = JsonValue>(
  req: ApiRequest,
): Promise<T> {
  const chunks: Buffer[] = []

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  const rawBody = Buffer.concat(chunks).toString('utf8').trim()

  if (!rawBody) {
    return {} as T
  }

  return JSON.parse(rawBody) as T
}
