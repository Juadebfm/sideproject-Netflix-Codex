import type { Db } from 'mongodb'

import { collectionNames } from '../../lib/collection-name.js'
import { mockRecommendations } from '../fixtures.js'
import type { RecommendationCard, RecommendationQuery } from './types.js'

export async function getRecommendations(
  db: Db | null,
  query: RecommendationQuery,
): Promise<RecommendationCard[]> {
  const limit = query.limit ?? 8

  if (db) {
    const collection = db.collection<RecommendationCard>(collectionNames.curatedCollections)
    const records = await collection.find({}).limit(limit).toArray()

    if (records.length > 0) {
      return records
    }
  }

  const filtered = mockRecommendations.filter((recommendation) => {
    if (query.groupFriendly && recommendation.reason === 'group-fit') {
      return true
    }

    if (query.mood && recommendation.reason === 'mood-match') {
      return true
    }

    if (!query.mood && !query.groupFriendly) {
      return true
    }

    return recommendation.reason === 'editorial'
  })

  return filtered.slice(0, limit)
}

export function getCuratedCollectionsCollectionName() {
  return collectionNames.curatedCollections
}
