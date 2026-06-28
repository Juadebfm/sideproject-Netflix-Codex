import { getOptionalDatabase } from '../../lib/runtime.js'
import { sendError, sendJson, type ApiRequest, type ApiResponse } from '../../lib/http.js'
import { requireMethod } from '../../lib/request.js'
import { getCategoryByCode } from '../../modules/catalog/index.js'

function extractCode(req: ApiRequest) {
  const url = req.url ?? ''
  const match = url.match(/\/api\/categories\/([^/?#]+)/)
  return match?.[1]
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (!requireMethod(req, res, 'GET')) {
    return
  }

  const code = extractCode(req)

  if (!code) {
    sendError(res, 400, 'Category code is required')
    return
  }

  const db = await getOptionalDatabase()
  const category = await getCategoryByCode(db, code)

  if (!category) {
    sendError(res, 404, 'Category not found')
    return
  }

  sendJson(res, 200, {
    ok: true,
    data: category,
  })
}
