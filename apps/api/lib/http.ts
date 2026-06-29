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

export function setCorsHeaders(res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export function sendJson(
  res: ApiResponse,
  statusCode: number,
  payload: JsonValue,
) {
  res.statusCode = statusCode
  setCorsHeaders(res)
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
