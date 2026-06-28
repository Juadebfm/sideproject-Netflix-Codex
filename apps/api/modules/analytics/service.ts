import type { Db } from 'mongodb'

import { collectionNames } from '../../lib/collection-name.js'
import type { AnalyticsEvent } from './types.js'

export async function trackAnalyticsEvent(
  db: Db,
  event: AnalyticsEvent,
): Promise<void> {
  void db
  void event
}

export function getAnalyticsCollectionName() {
  return collectionNames.analyticsEvents
}
