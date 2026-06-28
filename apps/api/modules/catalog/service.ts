import type { Db } from 'mongodb'

import { collectionNames } from '../../lib/collection-name.js'
import { mockCategories } from '../fixtures.js'
import type { CanonicalCategory, CatalogSearchInput } from './types.js'

export async function searchCatalog(
  db: Db | null,
  input: CatalogSearchInput,
): Promise<CanonicalCategory[]> {
  const limit = input.limit ?? 12
  const normalizedQuery = input.query?.trim().toLowerCase()

  if (db) {
    const collection = db.collection<CanonicalCategory>(collectionNames.canonicalCategories)
    const filters = normalizedQuery
      ? {
          $or: [
            { title: { $regex: normalizedQuery, $options: 'i' } },
            { slug: { $regex: normalizedQuery, $options: 'i' } },
            { tags: { $elemMatch: { $regex: normalizedQuery, $options: 'i' } } },
          ],
        }
      : {}
    const records = await collection.find(filters).limit(limit).toArray()

    if (records.length > 0) {
      return records
    }
  }

  const filtered = normalizedQuery
    ? mockCategories.filter((category) => {
        return (
          category.title.toLowerCase().includes(normalizedQuery) ||
          category.slug.toLowerCase().includes(normalizedQuery) ||
          category.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
        )
      })
    : mockCategories

  return filtered.slice(0, limit)
}

export async function getCategoryByCode(
  db: Db | null,
  netflixCode: string,
): Promise<CanonicalCategory | null> {
  if (db) {
    const collection = db.collection<CanonicalCategory>(collectionNames.canonicalCategories)
    const record = await collection.findOne({ netflixCode })

    if (record) {
      return record
    }
  }

  return mockCategories.find((category) => category.netflixCode === netflixCode) ?? null
}

export function getCatalogCollectionName() {
  return collectionNames.canonicalCategories
}
