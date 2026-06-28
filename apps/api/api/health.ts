import type { IncomingMessage, ServerResponse } from 'node:http'

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

function sendJson(
  res: ServerResponse<IncomingMessage>,
  statusCode: number,
  payload: JsonValue,
) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

export default function handler(
  _req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) {
  sendJson(res, 200, {
    ok: true,
    app: 'netflix-codex-api',
    message: 'PR 1 foundation ready',
  })
}
