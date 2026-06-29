export type RecommendationReason =
  | 'editorial'
  | 'group-fit'
  | 'mood-match'
  | 'runtime-fit'
  | 'region-match'

export type RecommendationCard = {
  categoryCode: string
  title: string
  reason: RecommendationReason
  confidenceLabel: 'high' | 'medium' | 'emerging'
  regions: string[]
  regionSignal: 'best-effort'
}

export type CuratedRecommendationRecord = RecommendationCard & {
  groupFriendly: boolean
  moods: string[]
  sourceRecordIds: string[]
  createdAt: string
  updatedAt: string
}

export type RecommendationQuery = {
  mood?: string
  region?: string
  groupFriendly?: boolean
  limit?: number
}

export type RecommendationResponseMeta = {
  count: number
  requestedRegion: string | null
  appliedRegion: string | null
  regionFallback: boolean
  availableRegions: string[]
}

export type RecommendationResult = {
  recommendations: RecommendationCard[]
  meta: RecommendationResponseMeta
}
