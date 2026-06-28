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
}

export type RecommendationQuery = {
  mood?: string
  region?: string
  groupFriendly?: boolean
  limit?: number
}
