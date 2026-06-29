import { safeReadServerEnv } from './env.js'
import { sendError, type ApiRequest, type ApiResponse } from './http.js'

function getHeader(req: ApiRequest, key: string) {
  const rawValue = req.headers[key]

  if (Array.isArray(rawValue)) {
    return rawValue[0]
  }

  return rawValue
}

function readBearerToken(req: ApiRequest) {
  const authorizationHeader = getHeader(req, 'authorization')

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null
  }

  return authorizationHeader.slice('Bearer '.length).trim()
}

export function requireCronAccess(req: ApiRequest, res: ApiResponse) {
  return requireCronAccessWithEnv(req, res, process.env)
}

export function requireCronAccessWithEnv(
  req: ApiRequest,
  res: ApiResponse,
  rawEnv: NodeJS.ProcessEnv,
) {
  const envResult = safeReadServerEnv(rawEnv)
  const cronSecret = envResult.success ? envResult.data.CRON_SECRET : undefined
  const bearerToken = readBearerToken(req)
  const headerSecret = getHeader(req, 'x-cron-secret')
  const cronScheduleHeader = getHeader(req, 'x-vercel-cron-schedule')

  if (cronSecret && (bearerToken === cronSecret || headerSecret === cronSecret)) {
    return {
      authorized: true as const,
      source: 'secret',
      schedule: cronScheduleHeader ?? null,
    }
  }

  sendError(
    res,
    401,
    'Unauthorized cron request',
    cronSecret
      ? 'Provide a matching Authorization bearer token or x-cron-secret header.'
      : 'Set CRON_SECRET before enabling scheduled ingestion.',
  )

  return {
    authorized: false as const,
    source: 'unauthorized',
    schedule: cronScheduleHeader ?? null,
  }
}
