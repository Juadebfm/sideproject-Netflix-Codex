import { Db, MongoClient } from 'mongodb'

import { readServerEnv } from './env.js'

type MongoCache = {
  client: MongoClient | null
  promise: Promise<MongoClient> | null
}

const globalForMongo = globalThis as typeof globalThis & {
  __netflixCodexMongo?: MongoCache
}

const mongoCache = globalForMongo.__netflixCodexMongo ?? {
  client: null,
  promise: null,
}

if (!globalForMongo.__netflixCodexMongo) {
  globalForMongo.__netflixCodexMongo = mongoCache
}

export async function getMongoClient() {
  if (mongoCache.client) {
    return mongoCache.client
  }

  if (!mongoCache.promise) {
    const env = readServerEnv()
    const client = new MongoClient(env.MONGODB_URI)

    mongoCache.promise = client.connect().then((connectedClient) => {
      mongoCache.client = connectedClient
      return connectedClient
    })
  }

  return mongoCache.promise
}

export async function getDatabase(): Promise<Db> {
  const env = readServerEnv()
  const client = await getMongoClient()

  return client.db(env.MONGODB_DB_NAME)
}
