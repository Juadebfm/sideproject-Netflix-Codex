import type { Db } from 'mongodb'

import { collectionNames, type CollectionName } from './collection-name.js'

export class CatalogUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CatalogUnavailableError'
  }
}

export async function assertCollectionReady(
  db: Db,
  collectionName: CollectionName,
  message: string,
) {
  const existingDocument = await db
    .collection(collectionName)
    .findOne({}, { projection: { _id: 1 } })

  if (!existingDocument) {
    throw new CatalogUnavailableError(message)
  }
}

export async function assertDiscoveryCatalogReady(db: Db) {
  await assertCollectionReady(
    db,
    collectionNames.canonicalCategories,
    'Canonical catalog is unavailable',
  )
  await assertCollectionReady(
    db,
    collectionNames.curatedCollections,
    'Curated recommendations are unavailable',
  )
}
