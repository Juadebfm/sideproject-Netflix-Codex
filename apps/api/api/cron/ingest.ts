import { requireCronAccess } from '../../lib/cron.js'
import { sendError, sendJson, type ApiRequest, type ApiResponse } from '../../lib/http.js'
import { requireMethod } from '../../lib/request.js'
import { getRequiredDatabase } from '../../lib/runtime.js'
import { runScheduledIngestion } from '../../modules/ingestion/index.js'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, 'GET')) {
    return
  }

  const access = requireCronAccess(req, res)

  if (!access.authorized) {
    return
  }

  let db

  try {
    db = await getRequiredDatabase()
  } catch {
    sendError(res, 503, 'Scheduled ingestion requires a configured database')
    return
  }

  const result = await runScheduledIngestion(db, access.schedule)

  sendJson(res, 200, {
    ok: true,
    data: result,
    meta: {
      accessSource: access.source,
      dbConnected: true,
    },
  })
}
