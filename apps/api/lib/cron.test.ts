import assert from 'node:assert/strict'
import { PassThrough } from 'node:stream'
import test from 'node:test'

import type { ApiRequest, ApiResponse } from './http.js'
import { requireCronAccessWithEnv } from './cron.js'

function createResponse() {
  const headers = new Map<string, string>()
  let body = ''

  const response = {
    statusCode: 200,
    setHeader(name: string, value: string) {
      headers.set(name, value)
      return response
    },
    end(chunk?: string) {
      if (chunk) {
        body += chunk
      }
      return response
    },
  } as unknown as ApiResponse

  return {
    response,
    readBody() {
      return body
    },
    getHeader(name: string) {
      return headers.get(name)
    },
  }
}

function createRequest(headers: Record<string, string | undefined>) {
  const stream = new PassThrough() as PassThrough & {
    headers: Record<string, string | undefined>
    method: string
    url: string
  }
  stream.end()
  stream.headers = headers
  stream.method = 'GET'
  stream.url = '/api/cron/ingest'
  return stream as unknown as ApiRequest
}

test('requireCronAccess only authorizes matching secrets', () => {
  const { response } = createResponse()
  const request = createRequest({
    authorization: 'Bearer top-secret',
  })

  const access = requireCronAccessWithEnv(request, response, {
    NODE_ENV: 'development',
    MONGODB_URI: 'mongodb://localhost:27017/netflix-codex',
    MONGODB_DB_NAME: 'netflix-codex',
    CRON_SECRET: 'top-secret',
  })

  assert.equal(access.authorized, true)
  assert.equal(access.source, 'secret')
})

test('requireCronAccess rejects preview header spoofing without a secret', () => {
  const { response, readBody } = createResponse()
  const request = createRequest({
    'x-vercel-cron-schedule': '0 * * * *',
    'user-agent': 'vercel-cron/1.0',
  })

  const access = requireCronAccessWithEnv(request, response, {
    NODE_ENV: 'development',
    MONGODB_URI: 'mongodb://localhost:27017/netflix-codex',
    MONGODB_DB_NAME: 'netflix-codex',
  })

  assert.equal(access.authorized, false)
  assert.equal(access.source, 'unauthorized')
  assert.match(readBody(), /Set CRON_SECRET/)
})
