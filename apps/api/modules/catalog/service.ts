import { collectionNames } from '../../lib/collection-name.js'
import { assertCollectionReady } from '../../lib/catalog-state.js'
import { getRequiredDatabase } from '../../lib/runtime.js'

import type { CanonicalCategory, CatalogSearchInput, PublicCategory } from './types.js'

function toPublicCategory(category: CanonicalCategory): PublicCategory {
  const sourceLabels = Array.isArray(category.sourceLabels) ? category.sourceLabels : []

  return {
    netflixCode: category.netflixCode,
    title: category.title,
    regions: category.regions,
    regionSignal: category.regionSignal,
    sourceLabels,
    sourceCount: sourceLabels.length,
    titleSourceLabel: category.titleSourceLabel || sourceLabels[0] || 'Catalog refresh pending',
    verificationState: category.verificationState ?? 'manual-curated',
  }
}

export async function searchCatalog(input: CatalogSearchInput): Promise<PublicCategory[]> {
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

  return filtered.slice(0, limit).map(toPublicCategory)
}

export async function getCategoryByCode(netflixCode: string): Promise<PublicCategory | null> {
  const db = await getRequiredDatabase()
  await assertCollectionReady(
    db,
    collectionNames.canonicalCategories,
    'Canonical catalog is unavailable',
  )

  const category = await db
    .collection<CanonicalCategory>(collectionNames.canonicalCategories)
    .findOne({ netflixCode })

  return category ? toPublicCategory(category) : null
}

export function getCatalogCollectionName() {
  return collectionNames.canonicalCategories
}
