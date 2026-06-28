export type CanonicalCategory = {
  netflixCode: string
  slug: string
  title: string
  summary: string
  tags: string[]
}

export type RecommendationCard = {
  categoryCode: string
  title: string
  reason: 'editorial' | 'group-fit' | 'mood-match' | 'runtime-fit' | 'region-match'
  confidenceLabel: 'high' | 'medium' | 'emerging'
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
}

const fallbackCategories: CanonicalCategory[] = [
  {
    netflixCode: '1365',
    slug: 'action-adventure',
    title: 'Action and Adventure',
    summary: 'Big-energy films for nights when browsing needs to end quickly.',
    tags: ['action', 'fast-paced', 'group-friendly'],
  },
  {
    netflixCode: '8711',
    slug: 'thrillers',
    title: 'Thrillers',
    summary: 'High-tension picks when you want something gripping without guesswork.',
    tags: ['thriller', 'tense', 'date-night'],
  },
  {
    netflixCode: '7424',
    slug: 'anime',
    title: 'Anime',
    summary: 'A focused entry point for viewers chasing standout anime finds.',
    tags: ['anime', 'stylized', 'fandom'],
  },
  {
    netflixCode: '783',
    slug: 'children-family-movies',
    title: 'Children and Family Movies',
    summary: 'Safer family-first choices when a group needs an easier yes.',
    tags: ['family', 'group-friendly', 'weekend'],
  },
]

const fallbackRecommendations: RecommendationCard[] = [
  {
    categoryCode: '8711',
    title: 'Thrillers for a no-scroll movie night',
    reason: 'editorial',
    confidenceLabel: 'high',
  },
  {
    categoryCode: '783',
    title: 'Family picks everyone can agree on',
    reason: 'group-fit',
    confidenceLabel: 'high',
  },
  {
    categoryCode: '1365',
    title: 'Fast, high-energy action tonight',
    reason: 'mood-match',
    confidenceLabel: 'medium',
  },
]

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

function buildUrl(path: string) {
  if (!apiBaseUrl) {
    return path
  }

  return `${apiBaseUrl}${path}`
}

async function fetchJson<T>(path: string, init?: RequestInit) {
  const response = await fetch(buildUrl(path), init)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return (await response.json()) as ApiResponse<T>
}

export async function searchCategories(query: string) {
  try {
    const searchParams = new URLSearchParams()

    if (query.trim()) {
      searchParams.set('query', query.trim())
    }

    const response = await fetchJson<CanonicalCategory[]>(
      `/api/search?${searchParams.toString()}`,
    )

    return response.data
  } catch {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return fallbackCategories
    }

    return fallbackCategories.filter((category) => {
      return (
        category.title.toLowerCase().includes(normalizedQuery) ||
        category.slug.toLowerCase().includes(normalizedQuery) ||
        category.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      )
    })
  }
}

export async function fetchRecommendations(input: {
  mood?: string
  region?: string
  groupFriendly?: boolean
}) {
  try {
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

    return response.data
  } catch {
    return fallbackRecommendations
  }
}

export async function fetchCategory(code: string) {
  try {
    const response = await fetchJson<CanonicalCategory>(`/api/categories/${code}`)
    return response.data
  } catch {
    return (
      fallbackCategories.find((category) => category.netflixCode === code) ?? null
    )
  }
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
