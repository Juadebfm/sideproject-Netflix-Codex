import { assertDiscoveryCatalogReady, CatalogUnavailableError } from '../lib/catalog-state.js'
import { safeReadServerEnv } from '../lib/env.js'
import { sendError, sendJson, type ApiRequest, type ApiResponse } from '../lib/http.js'
import { getRequiredDatabase } from '../lib/runtime.js'
import * as modules from '../modules/index.js'

export default async function handler(_req: ApiRequest, res: ApiResponse) {
  const envResult = safeReadServerEnv()

  if (!envResult.success) {
    sendError(res, 503, 'Server environment is not configured')
    return
  }

  try {
    const db = await getRequiredDatabase()
    await assertDiscoveryCatalogReady(db)
  } catch (error) {
    if (error instanceof CatalogUnavailableError) {
      sendError(res, 503, error.message)
      return
    }

    sendError(res, 503, 'Database connection is unavailable')
    return
  }

  sendJson(res, 200, {
    ok: true,
    app: 'netflix-codex-api',
    message: 'Discovery API ready',
    env: {
      configured: true,
      dbName: envResult.data.MONGODB_DB_NAME,
      cronProtected: Boolean(envResult.data.CRON_SECRET),
    },
    modules: Object.keys(modules),
  })
}
