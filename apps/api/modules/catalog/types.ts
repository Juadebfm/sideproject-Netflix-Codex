export type CategoryVerificationState = 'source-backed' | 'manual-curated'

export type CanonicalCategory = {
  _id?: string
  netflixCode: string
  slug: string
  title: string
  tags: string[]
  regions: string[]
  regionSignal: 'best-effort'
  sourceRecordIds: string[]
  sourceLabels: string[]
  titleSourceLabel: string
  verificationState: CategoryVerificationState
  createdAt: string
  updatedAt: string
}

export type PublicCategory = {
  netflixCode: string
  title: string
  regions: string[]
  regionSignal: 'best-effort'
  sourceLabels: string[]
  sourceCount: number
  titleSourceLabel: string
  verificationState: CategoryVerificationState
}

export type CatalogSearchInput = {
  query?: string
  limit?: number
}
