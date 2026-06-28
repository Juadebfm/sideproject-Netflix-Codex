import type { Db } from 'mongodb'

import { collectionNames } from '../../lib/collection-name.js'
import type { RecommendationCard, RecommendationQuery } from './types.js'

export async function getRecommendations(
  db: Db,
  query: RecommendationQuery,
): Promise<RecommendationCard[]> {
  void db
  void query

  return []
}

export function getCuratedCollectionsCollectionName() {
  return collectionNames.curatedCollections
}
