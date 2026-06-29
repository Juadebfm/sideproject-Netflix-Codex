import { CatalogUnavailableError } from '../lib/catalog-state.js'
import { sendError, sendJson, type ApiRequest, type ApiResponse } from '../lib/http.js'
import { getNumberQueryParam, getQueryParam, requireMethod } from '../lib/request.js'
import { getRecommendations } from '../modules/recommendations/index.js'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, 'GET')) {
    return
  }

  const mood = getQueryParam(req, 'mood')
  const region = getQueryParam(req, 'region')
  const groupFriendly = getQueryParam(req, 'groupFriendly') === 'true'
  const limit = getNumberQueryParam(req, 'limit', 8)

  try {
    const result = await getRecommendations({
      mood,
      region,
      groupFriendly,
      limit,
    })

    sendJson(res, 200, {
      ok: true,
      data: result.recommendations,
      meta: result.meta,
    })
  } catch (error) {
    const message =
      error instanceof CatalogUnavailableError
        ? error.message
        : 'Curated recommendations are unavailable'
    sendError(res, 503, message)
  }
}
