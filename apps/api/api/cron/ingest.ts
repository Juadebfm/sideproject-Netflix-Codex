import { requireCronAccess } from '../../lib/cron.js'
import { sendJson, type ApiRequest, type ApiResponse } from '../../lib/http.js'
import { requireMethod } from '../../lib/request.js'
import { getOptionalDatabase } from '../../lib/runtime.js'
import { runScheduledIngestion } from '../../modules/ingestion/index.js'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, 'GET')) {
    return
  }

  const access = requireCronAccess(req, res)

  if (!access.authorized) {
    return
  }

  const db = await getOptionalDatabase()
  const result = await runScheduledIngestion(db, access.schedule)

  sendJson(res, 200, {
    ok: true,
    data: result,
    meta: {
      accessSource: access.source,
      dbConnected: Boolean(db),
    },
  })
}
