import type { Db } from 'mongodb'

import { collectionNames } from '../../lib/collection-name.js'
import type { CanonicalCategory, CatalogSearchInput } from './types.js'

export async function searchCatalog(
  db: Db,
  input: CatalogSearchInput,
): Promise<CanonicalCategory[]> {
  void db
  void input

  return []
}

export function getCatalogCollectionName() {
  return collectionNames.canonicalCategories
}
