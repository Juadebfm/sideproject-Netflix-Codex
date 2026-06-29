import { collectionNames } from '../../lib/collection-name.js'
import { assertCollectionReady } from '../../lib/catalog-state.js'
import { getRequiredDatabase } from '../../lib/runtime.js'

import type { CanonicalCategory, CatalogSearchInput } from './types.js'

export async function searchCatalog(input: CatalogSearchInput): Promise<CanonicalCategory[]> {
  const db = await getRequiredDatabase()
  await assertCollectionReady(
    db,
    collectionNames.canonicalCategories,
    'Canonical catalog is unavailable',
  )

  const limit = input.limit ?? 12
  const normalizedQuery = input.query?.trim().toLowerCase()
  const categories = await db
    .collection<CanonicalCategory>(collectionNames.canonicalCategories)
    .find({})
    .toArray()
  const filtered = normalizedQuery
    ? categories.filter((category) => {
        return (
          category.title.toLowerCase().includes(normalizedQuery) ||
          category.slug.toLowerCase().includes(normalizedQuery) ||
          category.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
        )
      })
    : categories

  return filtered.slice(0, limit)
}

export async function getCategoryByCode(netflixCode: string): Promise<CanonicalCategory | null> {
  const db = await getRequiredDatabase()
  await assertCollectionReady(
    db,
    collectionNames.canonicalCategories,
    'Canonical catalog is unavailable',
  )

  return (
    (await db
      .collection<CanonicalCategory>(collectionNames.canonicalCategories)
      .findOne({ netflixCode })) ?? null
  )
}

export function getCatalogCollectionName() {
  return collectionNames.canonicalCategories
}
