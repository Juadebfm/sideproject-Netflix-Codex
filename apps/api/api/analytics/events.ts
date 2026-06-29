import { z } from 'zod'

import { sendError, sendJson, type ApiRequest, type ApiResponse } from '../../lib/http.js'
import { InvalidJsonBodyError, readJsonBody, requireMethod } from '../../lib/request.js'
import { getRequiredDatabase } from '../../lib/runtime.js'
import { trackAnalyticsEvent } from '../../modules/analytics/index.js'
import { supportedAnalyticsEvents } from '../../modules/seed-data.js'

const analyticsEventSchema = z.object({
  name: z.enum(supportedAnalyticsEvents),
  sessionId: z.string().min(1),
  occurredAt: z.string().datetime().optional(),
  metadata: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional(),
})

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, 'POST')) {
    return
  }

  let rawBody

  try {
    rawBody = await readJsonBody(req)
  } catch (error) {
    if (error instanceof InvalidJsonBodyError) {
      sendError(res, 400, error.message)
      return
    }

    throw error
  }

  const parsedBody = analyticsEventSchema.safeParse(rawBody)

  if (!parsedBody.success) {
    sendError(
      res,
      400,
      'Invalid analytics event payload',
      parsedBody.error.flatten().fieldErrors,
    )
    return
  }

  let db

  try {
    db = await getRequiredDatabase()
  } catch {
    sendError(res, 503, 'Analytics storage is unavailable')
    return
  }

  const event = {
    ...parsedBody.data,
    occurredAt: parsedBody.data.occurredAt ?? new Date().toISOString(),
  }

  await trackAnalyticsEvent(db, event)

  sendJson(res, 202, {
    ok: true,
    data: {
      accepted: true,
      name: event.name,
    },
  })
}
