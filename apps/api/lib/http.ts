import type { IncomingMessage, ServerResponse } from 'node:http'

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export type ApiRequest = IncomingMessage
export type ApiResponse = ServerResponse<IncomingMessage>

export function sendJson(
  res: ApiResponse,
  statusCode: number,
  payload: JsonValue,
) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

export function sendError(
  res: ApiResponse,
  statusCode: number,
  message: string,
  details?: JsonValue,
) {
  sendJson(res, statusCode, {
    ok: false,
    error: message,
    details: details ?? null,
  })
}
