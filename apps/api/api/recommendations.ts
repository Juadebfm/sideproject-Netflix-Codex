import { getOptionalDatabase } from '../lib/runtime.js'
import { getNumberQueryParam, getQueryParam, requireMethod } from '../lib/request.js'
import { sendJson, type ApiRequest, type ApiResponse } from '../lib/http.js'
import { getRecommendations } from '../modules/recommendations/index.js'

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, 'GET')) {
    return
  }

  const db = await getOptionalDatabase()
  const mood = getQueryParam(req, 'mood')
  const region = getQueryParam(req, 'region')
  const groupFriendly = getQueryParam(req, 'groupFriendly') === 'true'
  const limit = getNumberQueryParam(req, 'limit', 8)
  const recommendations = await getRecommendations(db, {
    mood,
    region,
    groupFriendly,
    limit,
  })

  sendJson(res, 200, {
    ok: true,
    data: recommendations,
    meta: {
      count: recommendations.length,
    },
  })
}
