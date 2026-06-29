import type { Db } from 'mongodb'

import { collectionNames } from '../../lib/collection-name.js'
import type { AnalyticsEvent } from './types.js'

export async function trackAnalyticsEvent(
  db: Db | null,
  event: AnalyticsEvent,
): Promise<void> {
  if (!db) {
    return
  }

  const collection = db.collection<AnalyticsEvent>(collectionNames.analyticsEvents)
  await collection.insertOne(event)
}

export function getAnalyticsCollectionName() {
  return collectionNames.analyticsEvents
}
