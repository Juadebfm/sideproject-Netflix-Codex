import type { Db } from 'mongodb'

import { collectionNames } from '../../lib/collection-name.js'
import type { TaxonomyEntry, TaxonomyKind } from './types.js'

export async function listTaxonomyEntries(
  db: Db,
  kind?: TaxonomyKind,
): Promise<TaxonomyEntry[]> {
  void db
  void kind

  return []
}

export function getTaxonomyCollectionName() {
  return collectionNames.taxonomyEntries
}
