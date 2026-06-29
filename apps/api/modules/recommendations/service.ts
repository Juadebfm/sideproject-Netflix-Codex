import { collectionNames } from '../../lib/collection-name.js'
import { assertCollectionReady } from '../../lib/catalog-state.js'
import { getRequiredDatabase } from '../../lib/runtime.js'
import type {
  CuratedRecommendationRecord,
  RecommendationCard,
  RecommendationQuery,
  RecommendationResponseMeta,
  RecommendationResult,
} from './types.js'

function normalizeRegion(region: string | undefined) {
  return region?.trim().toUpperCase() || null
}

function normalizeMood(mood: string | undefined) {
  return mood?.trim().toLowerCase() || null
}

function collectAvailableRegions(recommendations: RecommendationCard[]) {
  return Array.from(
    new Set(recommendations.flatMap((recommendation) => recommendation.regions)),
  ).sort()
}

function toRecommendationCard(
  recommendation: CuratedRecommendationRecord,
): RecommendationCard {
  return {
    categoryCode: recommendation.categoryCode,
    title: recommendation.title,
    reason: recommendation.reason,
    confidenceLabel: recommendation.confidenceLabel,
    regions: recommendation.regions,
    regionSignal: recommendation.regionSignal,
  }
}

function buildMeta(
  recommendations: RecommendationCard[],
  requestedRegion: string | null,
  appliedRegion: string | null,
  regionFallback: boolean,
): RecommendationResponseMeta {
  return {
    count: recommendations.length,
    requestedRegion,
    appliedRegion,
    regionFallback,
    availableRegions: collectAvailableRegions(recommendations),
  }
}

export function buildRecommendationResult(
  records: CuratedRecommendationRecord[],
  query: RecommendationQuery,
): RecommendationResult {
  const limit = query.limit ?? 8
  const normalizedMood = normalizeMood(query.mood)
  const normalizedRegion = normalizeRegion(query.region)

  const baseMatches = records.filter((recommendation) => {
    const matchesMood = normalizedMood
      ? recommendation.moods.some((mood) => mood.includes(normalizedMood))
      : true
    const matchesGroupFriendly = query.groupFriendly ? recommendation.groupFriendly : true

    return matchesMood && matchesGroupFriendly
  })

  if (normalizedRegion) {
    const regionMatches = baseMatches.filter((recommendation) =>
      recommendation.regions.includes(normalizedRegion),
    )

    if (regionMatches.length > 0) {
      const recommendations = regionMatches.slice(0, limit).map(toRecommendationCard)
      return {
        recommendations,
        meta: buildMeta(recommendations, normalizedRegion, normalizedRegion, false),
      }
    }

    const broaderRecommendations = baseMatches.slice(0, limit).map(toRecommendationCard)
    return {
      recommendations: broaderRecommendations,
      meta: buildMeta(broaderRecommendations, normalizedRegion, null, true),
    }
  }

  const recommendations = baseMatches.slice(0, limit).map(toRecommendationCard)
  return {
    recommendations,
    meta: buildMeta(recommendations, null, null, false),
  }
}

export async function getRecommendations(
  query: RecommendationQuery,
): Promise<RecommendationResult> {
  const db = await getRequiredDatabase()
  await assertCollectionReady(
    db,
    collectionNames.curatedCollections,
    'Curated recommendations are unavailable',
  )

  const records = await db
    .collection<CuratedRecommendationRecord>(collectionNames.curatedCollections)
    .find({})
    .toArray()

  return buildRecommendationResult(records, query)
}

export function getCuratedCollectionsCollectionName() {
  return collectionNames.curatedCollections
}
