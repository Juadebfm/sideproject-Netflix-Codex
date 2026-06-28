export type CanonicalCategory = {
  _id?: string
  netflixCode: string
  slug: string
  title: string
  summary: string
  tags: string[]
  sourceRecordIds: string[]
  createdAt: string
  updatedAt: string
}

export type CatalogSearchInput = {
  query?: string
  limit?: number
}
