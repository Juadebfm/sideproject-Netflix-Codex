import type { Db } from 'mongodb'

import { collectionNames } from '../../lib/collection-name.js'
import type {
  IngestionRun,
  IngestionSource,
  ScheduledIngestionResult,
} from './types.js'

const configuredSources: IngestionSource[] = []

export async function listIngestionSources(): Promise<IngestionSource[]> {
  return configuredSources
}

export async function startIngestionRun(
  db: Db | null,
  sourceId: string,
): Promise<IngestionRun> {
  const run: IngestionRun = {
    sourceId,
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    status: 'succeeded',
  }

  if (db) {
    await db.collection<IngestionRun>(collectionNames.ingestionRuns).insertOne(run)
  }

  return run
}

export async function runScheduledIngestion(
  db: Db | null,
  schedule: string | null,
): Promise<ScheduledIngestionResult> {
  const sources = await listIngestionSources()

  if (sources.length === 0) {
    return {
      sourceCount: 0,
      runCount: 0,
      schedule,
      status: 'skipped',
      runs: [],
    }
  }

  const runs: IngestionRun[] = []

  for (const source of sources) {
    const run = await startIngestionRun(db, source.id)
    runs.push(run)
  }

  return {
    sourceCount: sources.length,
    runCount: runs.length,
    schedule,
    status: 'completed',
    runs,
  }
}

export function getRawSourceCollectionName() {
  return collectionNames.rawSourceRecords
}

export function getIngestionRunsCollectionName() {
  return collectionNames.ingestionRuns
}
