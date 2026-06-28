export type IngestionSource = {
  id: string
  label: string
  url: string
}

export type RawSourceRecord = {
  _id?: string
  sourceId: string
  fetchedAt: string
  payload: Record<string, unknown>
}

export type IngestionRun = {
  _id?: string
  sourceId: string
  startedAt: string
  completedAt?: string
  status: 'pending' | 'running' | 'succeeded' | 'failed'
}
