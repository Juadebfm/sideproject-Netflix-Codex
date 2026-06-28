export const collectionNames = {
  analyticsEvents: 'analytics_events',
  canonicalCategories: 'canonical_categories',
  curatedCollections: 'curated_collections',
  ingestionRuns: 'ingestion_runs',
  rawSourceRecords: 'raw_source_records',
  taxonomyEntries: 'taxonomy_entries',
} as const

export type CollectionName =
  (typeof collectionNames)[keyof typeof collectionNames]
