export type CanonicalCategory = {
  netflixCode: string
  title: string
  regions: string[]
  regionSignal: 'best-effort'
  sourceLabels: string[]
  sourceCount: number
  titleSourceLabel: string
  verificationState: 'source-backed' | 'manual-curated'
}

export type RecommendationCard = {
  categoryCode: string
  title: string
  reason: 'editorial' | 'group-fit' | 'mood-match' | 'runtime-fit' | 'region-match'
  confidenceLabel: 'high' | 'medium' | 'emerging'
  regions: string[]
  regionSignal: 'best-effort'
}

type AnalyticsEventName =
  | 'page_view'
  | 'search_submitted'
  | 'code_copied'
  | 'open_in_netflix_clicked'
  | 'recommendation_selected'

type ApiResponse<T> = {
  ok: boolean
  data: T
  meta?: Record<string, unknown>
}

export type RecommendationResponseMeta = {
  count: number
  requestedRegion: string | null
  appliedRegion: string | null
  regionFallback: boolean
  availableRegions: string[]
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function buildUrl(path: string) {
  if (!apiBaseUrl) {
    return path
  }

  return `${apiBaseUrl}${path}`
}

async function fetchJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(buildUrl(path), init)
  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | {
        error?: string
      }
    | null

  if (!response.ok) {
    const message =
      payload && 'error' in payload && payload.error
        ? payload.error
        : `Request failed with status ${response.status}`
    throw new ApiError(message, response.status)
  }

  return payload as ApiResponse<T>
}

export async function searchCategories(query: string, limit: number = 250) {
  const searchParams = new URLSearchParams()

  if (query.trim()) {
    searchParams.set('query', query.trim())
  }

  searchParams.set('limit', String(limit))

  const response = await fetchJson<CanonicalCategory[]>(
    `/api/search?${searchParams.toString()}`,
  )
  return response.data
}

export async function fetchRecommendations(input: {
  mood?: string
  region?: string
  groupFriendly?: boolean
}) {
  const searchParams = new URLSearchParams()

  if (input.mood?.trim()) {
    searchParams.set('mood', input.mood.trim())
  }

  if (input.region?.trim()) {
    searchParams.set('region', input.region.trim())
  }

  if (input.groupFriendly) {
    searchParams.set('groupFriendly', 'true')
  }

  const response = await fetchJson<RecommendationCard[]>(
    `/api/recommendations?${searchParams.toString()}`,
  )
  return {
    data: response.data,
    meta: response.meta as RecommendationResponseMeta,
  }
}

export async function fetchCategory(code: string) {
  const response = await fetchJson<CanonicalCategory>(`/api/categories/${code}`)
  return response.data
}

export async function trackAnalyticsEvent(input: {
  name: AnalyticsEventName
  sessionId: string
  metadata?: Record<string, string | number | boolean | null>
}) {
  try {
    await fetch(buildUrl('/api/analytics/events'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...input,
        occurredAt: new Date().toISOString(),
      }),
    })
  } catch {
    return
  }
}

export function getSessionId() {
  const storageKey = 'netflix-codex-session-id'

  try {
    const existingSessionId = window.localStorage.getItem(storageKey)

    if (existingSessionId) {
      return existingSessionId
    }

    const createdSessionId = `session-${crypto.randomUUID()}`
    window.localStorage.setItem(storageKey, createdSessionId)
    return createdSessionId
  } catch {
    return 'session-anonymous'
  }
}

export function buildNetflixGenreUrl(code: string) {
  return `https://www.netflix.com/browse/genre/${code}`
}

export function getReasonLabel(reason: RecommendationCard['reason']) {
  if (reason === 'group-fit') {
    return 'Group fit'
  }

  if (reason === 'mood-match') {
    return 'Mood match'
  }

  if (reason === 'runtime-fit') {
    return 'Runtime fit'
  }

  if (reason === 'region-match') {
    return 'Region fit'
  }

  return 'Editorial pick'
}

export function getRegionLabel(regions: string[]) {
  return regions.join(', ')
}

export function getVerificationLabel(verificationState: CanonicalCategory['verificationState']) {
  if (verificationState === 'manual-curated') {
    return 'Manual curated'
  }

  return 'Source-backed'
}

export function toUserMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiError && error.message.trim()) {
    return error.message
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return fallbackMessage
}
