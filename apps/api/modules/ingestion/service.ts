import { ObjectId, type Db } from 'mongodb'

import { collectionNames } from '../../lib/collection-name.js'
import type { CanonicalCategory } from '../catalog/types.js'
import type { CuratedRecommendationRecord } from '../recommendations/types.js'
import {
  seedRecommendations,
  type SeedRecommendation,
} from '../seed-data.js'
import {
  fetchNetflixCodesSnapshot,
} from './netflix-codes-source.js'
import { fetchTeenVogueSnapshot } from './teen-vogue-source.js'
import type {
  IngestionRun,
  IngestionSource,
  PreparedCanonicalCategoryCandidate,
  PreparedRecommendationCandidate,
  PreparedRawSourceRecord,
  PreparedSourceSnapshot,
  RawSourceRecord,
  ScheduledIngestionResult,
} from './types.js'

type PreparedStarterCatalogSnapshot = PreparedSourceSnapshot

export const starterCatalogSource: IngestionSource = {
  id: 'starter-catalog',
  label: 'Curated starter catalog',
  kind: 'local-starter',
  version: '2026-06-29',
  priority: 10,
}

export const netflixCodesSource: IngestionSource = {
  id: 'netflix-codes',
  label: 'Netflix-Codes',
  kind: 'remote-next-data',
  version: '2026-06-29',
  priority: 30,
  fetchUrl: 'https://www.netflix-codes.com/',
}

export const teenVogueSource: IngestionSource = {
  id: 'teen-vogue',
  label: 'Teen Vogue',
  kind: 'remote-json-ld-article',
  version: '2026-06-29',
  priority: 40,
  fetchUrl: 'https://www.teenvogue.com/story/netflix-secret-codes-unlock-hidden-shows-movies',
}

const configuredSources: IngestionSource[] = [
  starterCatalogSource,
  netflixCodesSource,
  teenVogueSource,
]

export async function listIngestionSources(): Promise<IngestionSource[]> {
  return configuredSources
}

function buildRawSourceRecord(
  source: IngestionSource,
  recordType: RawSourceRecord['recordType'],
  fetchedAt: string,
  payload: Record<string, unknown>,
): PreparedRawSourceRecord {
  return {
    _id: new ObjectId().toHexString(),
    sourceId: source.id,
    sourceLabel: source.label,
    sourceVersion: source.version,
    recordType,
    fetchedAt,
    payload,
  }
}

function normalizeRecommendation(
  recommendation: SeedRecommendation,
  source: IngestionSource,
  sourceRecordId: string,
  timestamp: string,
): PreparedRecommendationCandidate {
  return {
    categoryCode: recommendation.categoryCode,
    title: recommendation.title,
    reason: recommendation.reason,
    confidenceLabel: recommendation.confidenceLabel,
    regions: recommendation.regions,
    regionSignal: recommendation.regionSignal,
    groupFriendly: recommendation.groupFriendly,
    moods: recommendation.moods,
    sourceRecordIds: [sourceRecordId],
    createdAt: timestamp,
    updatedAt: timestamp,
    sourceId: source.id,
    sourcePriority: source.priority,
  }
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)))
}

function minIsoDate(values: string[]) {
  return [...values].sort()[0]
}

function maxIsoDate(values: string[]) {
  return [...values].sort().at(-1) ?? new Date().toISOString()
}

export function mergeCanonicalCategories(
  categories: PreparedCanonicalCategoryCandidate[],
): CanonicalCategory[] {
  const groups = new Map<string, PreparedCanonicalCategoryCandidate[]>()

  for (const category of categories) {
    const group = groups.get(category.netflixCode)
    if (group) {
      group.push(category)
      continue
    }

    groups.set(category.netflixCode, [category])
  }

  return [...groups.entries()]
    .map(([netflixCode, group]) => {
      const ordered = [...group].sort((left, right) => left.sourcePriority - right.sourcePriority)
      const winner = ordered[0]
      const title = ordered.find((candidate) => candidate.title.trim())?.title ?? winner.title

      return {
        netflixCode,
        slug: ordered.find((candidate) => candidate.slug.trim())?.slug ?? winner.slug,
        title,
        tags: uniqueStrings(ordered.flatMap((candidate) => candidate.tags)),
        regions: uniqueStrings(ordered.flatMap((candidate) => candidate.regions)),
        regionSignal: winner.regionSignal,
        sourceRecordIds: uniqueStrings(
          ordered.flatMap((candidate) => candidate.sourceRecordIds),
        ),
        sourceLabels: uniqueStrings(
          ordered.flatMap((candidate) => candidate.sourceLabels),
        ),
        titleSourceLabel:
          ordered.find((candidate) => candidate.title.trim())?.titleSourceLabel
          ?? winner.titleSourceLabel,
        verificationState:
          ordered.find((candidate) => candidate.title.trim())?.verificationState
          ?? winner.verificationState,
        createdAt: minIsoDate(ordered.map((candidate) => candidate.createdAt)),
        updatedAt: maxIsoDate(ordered.map((candidate) => candidate.updatedAt)),
      }
    })
    .sort((left, right) => left.title.localeCompare(right.title))
}

function mergeCuratedRecommendations(
  recommendations: PreparedRecommendationCandidate[],
): CuratedRecommendationRecord[] {
  const groups = new Map<string, PreparedRecommendationCandidate[]>()

  for (const recommendation of recommendations) {
    const key = `${recommendation.categoryCode}:${recommendation.title}`
    const group = groups.get(key)
    if (group) {
      group.push(recommendation)
      continue
    }

    groups.set(key, [recommendation])
  }

  return [...groups.values()].map((group) => {
    const ordered = [...group].sort((left, right) => left.sourcePriority - right.sourcePriority)
    const winner = ordered[0]

    return {
      ...winner,
      regions: uniqueStrings(ordered.flatMap((candidate) => candidate.regions)),
      moods: uniqueStrings(ordered.flatMap((candidate) => candidate.moods)),
      sourceRecordIds: uniqueStrings(
        ordered.flatMap((candidate) => candidate.sourceRecordIds),
      ),
      createdAt: minIsoDate(ordered.map((candidate) => candidate.createdAt)),
      updatedAt: maxIsoDate(ordered.map((candidate) => candidate.updatedAt)),
    }
  })
}

export function prepareStarterCatalogSnapshot(
  source: IngestionSource = starterCatalogSource,
  timestamp: string = new Date().toISOString(),
): PreparedStarterCatalogSnapshot {
  const recommendationRawRecords = seedRecommendations.map((recommendation) =>
    buildRawSourceRecord(source, 'recommendation', timestamp, { ...recommendation }),
  )

  const curatedRecommendations = seedRecommendations.map((recommendation, index) =>
    normalizeRecommendation(
      recommendation,
      source,
      recommendationRawRecords[index]._id,
      timestamp,
    ),
  )

  return {
    rawRecords: recommendationRawRecords,
    canonicalCategories: [],
    curatedRecommendations,
  }
}

export async function startIngestionRun(
  db: Db,
  source: IngestionSource,
): Promise<IngestionRun> {
  const run: IngestionRun = {
    _id: new ObjectId().toHexString(),
    sourceId: source.id,
    sourceLabel: source.label,
    sourceVersion: source.version,
    startedAt: new Date().toISOString(),
    status: 'running',
    rawRecordCount: 0,
    categoryCount: 0,
    recommendationCount: 0,
    errorMessage: null,
  }

  await db.collection<IngestionRun>(collectionNames.ingestionRuns).insertOne(run)

  return run
}

async function syncCanonicalCategories(
  db: Db,
  categories: CanonicalCategory[],
) {
  const collection = db.collection<CanonicalCategory>(collectionNames.canonicalCategories)

  if (categories.length > 0) {
    await collection.bulkWrite(
      categories.map((category) => ({
        replaceOne: {
          filter: { netflixCode: category.netflixCode },
          replacement: category,
          upsert: true,
        },
      })),
    )
  }

  await collection.deleteMany({
    netflixCode: {
      $nin: categories.map((category) => category.netflixCode),
    },
  })
}

async function syncCuratedRecommendations(
  db: Db,
  recommendations: CuratedRecommendationRecord[],
) {
  const collection = db.collection<CuratedRecommendationRecord>(
    collectionNames.curatedCollections,
  )

  if (recommendations.length > 0) {
    await collection.bulkWrite(
      recommendations.map((recommendation) => ({
        replaceOne: {
          filter: {
            categoryCode: recommendation.categoryCode,
            title: recommendation.title,
          },
          replacement: recommendation,
          upsert: true,
        },
      })),
    )
  }

  if (recommendations.length === 0) {
    await collection.deleteMany({})
    return
  }

  await collection.deleteMany({
    $nor: recommendations.map((recommendation) => ({
      categoryCode: recommendation.categoryCode,
      title: recommendation.title,
    })),
  })
}

async function completeIngestionRun(
  db: Db,
  run: IngestionRun,
  counts: {
    rawRecordCount: number
    categoryCount: number
    recommendationCount: number
  },
) {
  const completedRun: IngestionRun = {
    ...run,
    completedAt: new Date().toISOString(),
    status: 'succeeded',
    ...counts,
  }

  await db.collection<IngestionRun>(collectionNames.ingestionRuns).replaceOne(
    { _id: run._id },
    completedRun,
  )

  return completedRun
}

async function failIngestionRun(
  db: Db,
  run: IngestionRun,
  error: unknown,
) {
  const failedRun: IngestionRun = {
    ...run,
    completedAt: new Date().toISOString(),
    status: 'failed',
    errorMessage: error instanceof Error ? error.message : 'Unknown ingestion error',
  }

  await db.collection<IngestionRun>(collectionNames.ingestionRuns).replaceOne(
    { _id: run._id },
    failedRun,
  )

  return failedRun
}

async function prepareSnapshotForSource(
  source: IngestionSource,
  timestamp: string,
): Promise<PreparedSourceSnapshot> {
  if (source.kind === 'local-starter') {
    return prepareStarterCatalogSnapshot(source, timestamp)
  }

  if (source.kind === 'remote-next-data') {
    return fetchNetflixCodesSnapshot(source, timestamp)
  }

  if (source.kind === 'remote-json-ld-article') {
    return fetchTeenVogueSnapshot(source, timestamp)
  }

  throw new Error(`Unsupported ingestion source kind: ${source.kind}`)
}

async function ingestConfiguredSources(
  db: Db,
  sources: IngestionSource[],
): Promise<IngestionRun[]> {
  const runs: IngestionRun[] = []
  const snapshots: PreparedSourceSnapshot[] = []

  for (const source of sources) {
    const run = await startIngestionRun(db, source)

    try {
      const snapshot = await prepareSnapshotForSource(source, run.startedAt)

      if (snapshot.rawRecords.length > 0) {
        await db
          .collection<RawSourceRecord>(collectionNames.rawSourceRecords)
          .insertMany(snapshot.rawRecords)
      }

      snapshots.push(snapshot)
      runs.push(
        await completeIngestionRun(db, run, {
          rawRecordCount: snapshot.rawRecords.length,
          categoryCount: snapshot.canonicalCategories.length,
          recommendationCount: snapshot.curatedRecommendations.length,
        }),
      )
    } catch (error) {
      await failIngestionRun(db, run, error)
      throw error
    }
  }

  const canonicalCategories = mergeCanonicalCategories(
    snapshots.flatMap((snapshot) => snapshot.canonicalCategories),
  )
  const curatedRecommendations = mergeCuratedRecommendations(
    snapshots.flatMap((snapshot) => snapshot.curatedRecommendations),
  )

  await syncCanonicalCategories(db, canonicalCategories)
  await syncCuratedRecommendations(db, curatedRecommendations)

  return runs
}

export async function runStarterCatalogIngestion(db: Db) {
  const [run] = await ingestConfiguredSources(db, [starterCatalogSource])
  return run
}

export async function runConfiguredCatalogIngestion(db: Db) {
  return ingestConfiguredSources(db, configuredSources)
}

export async function runScheduledIngestion(
  db: Db,
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

  const runs = await ingestConfiguredSources(db, sources)

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
