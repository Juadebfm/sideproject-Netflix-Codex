import { CatalogUnavailableError } from '../lib/catalog-state.js'
import { sendError, sendJson, type ApiRequest, type ApiResponse } from '../lib/http.js'
import { getNumberQueryParam, getQueryParam, requireMethod } from '../lib/request.js'
import { searchCatalog } from '../modules/catalog/index.js'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, 'GET')) {
    return
  }

  const query = getQueryParam(req, 'query')
  const limit = getNumberQueryParam(req, 'limit', 12)

  try {
    const categories = await searchCatalog({ query, limit })

    sendJson(res, 200, {
      ok: true,
      data: categories,
      meta: {
        query: query ?? null,
        count: categories.length,
      },
    })
  } catch (error) {
    const message =
      error instanceof CatalogUnavailableError ? error.message : 'Catalog is unavailable'
    sendError(res, 503, message)
  }
}
