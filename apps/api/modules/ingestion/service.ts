import type { Db } from 'mongodb'

import { collectionNames } from '../../lib/collection-name.js'
import type { IngestionRun, IngestionSource } from './types.js'

export async function listIngestionSources(): Promise<IngestionSource[]> {
  return []
}

export async function startIngestionRun(
  db: Db,
  sourceId: string,
): Promise<IngestionRun> {
  void db

  return {
    sourceId,
    startedAt: new Date().toISOString(),
    status: 'pending',
  }
}

export function getRawSourceCollectionName() {
  return collectionNames.rawSourceRecords
}

export function getIngestionRunsCollectionName() {
  return collectionNames.ingestionRuns
}
