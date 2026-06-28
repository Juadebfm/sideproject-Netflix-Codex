import { safeReadServerEnv } from '../lib/env.js'
import { sendJson, type ApiRequest, type ApiResponse } from '../lib/http.js'
import * as modules from '../modules/index.js'

export default function handler(_req: ApiRequest, res: ApiResponse) {
  const envResult = safeReadServerEnv()

  sendJson(res, 200, {
    ok: true,
    app: 'netflix-codex-api',
    message: 'PR 2 server foundation ready',
    env: {
      configured: envResult.success,
      dbName: envResult.success ? envResult.data.MONGODB_DB_NAME : null,
      cronProtected: envResult.success ? Boolean(envResult.data.CRON_SECRET) : false,
    },
    modules: Object.keys(modules),
  })
}
