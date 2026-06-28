import { getOptionalDatabase } from '../lib/runtime.js'
import { getNumberQueryParam, getQueryParam, requireMethod } from '../lib/request.js'
import { sendJson, type ApiRequest, type ApiResponse } from '../lib/http.js'
import { searchCatalog } from '../modules/catalog/index.js'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, 'GET')) {
    return
  }

  const db = await getOptionalDatabase()
  const query = getQueryParam(req, 'query')
  const limit = getNumberQueryParam(req, 'limit', 12)
  const categories = await searchCatalog(db, { query, limit })

  sendJson(res, 200, {
    ok: true,
    data: categories,
    meta: {
      query: query ?? null,
      count: categories.length,
    },
  })
}
