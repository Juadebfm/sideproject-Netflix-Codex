import type { CanonicalCategory } from '../catalog/types.js'
import type { CuratedRecommendationRecord } from '../recommendations/types.js'

export type IngestionSource = {
  id: string
  label: string
  kind: 'local-starter' | 'remote-next-data' | 'remote-json-ld-article'
  version: string
  priority: number
  fetchUrl?: string
}

export type RawSourceRecord = {
  _id?: string
  sourceId: string
  sourceLabel: string
  sourceVersion: string
  recordType: 'category' | 'recommendation'
  fetchedAt: string
  payload: Record<string, unknown>
}

export type IngestionRun = {
  _id?: string
  sourceId: string
  sourceLabel: string
  sourceVersion: string
  startedAt: string
  completedAt?: string
  status: 'pending' | 'running' | 'succeeded' | 'failed'
  rawRecordCount: number
  categoryCount: number
  recommendationCount: number
  errorMessage?: string | null
}

export type ScheduledIngestionResult = {
  sourceCount: number
  runCount: number
  schedule: string | null
  status: 'skipped' | 'completed'
  runs: IngestionRun[]
}

export type PreparedRawSourceRecord = RawSourceRecord & {
  _id: string
}

export type PreparedCanonicalCategoryCandidate = CanonicalCategory & {
  sourceId: string
  sourcePriority: number
}

export type PreparedRecommendationCandidate = CuratedRecommendationRecord & {
  sourceId: string
  sourcePriority: number
}

export type PreparedSourceSnapshot = {
  rawRecords: PreparedRawSourceRecord[]
  canonicalCategories: PreparedCanonicalCategoryCandidate[]
  curatedRecommendations: PreparedRecommendationCandidate[]
}
