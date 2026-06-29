import { readServerEnv, safeReadServerEnv } from './env.js'
import { getDatabase } from './mongodb.js'

export async function getRequiredDatabase() {
  readServerEnv()
  return getDatabase()
}

export async function getOptionalDatabase() {
  const envResult = safeReadServerEnv()

  if (!envResult.success) {
    return null
  }

  try {
    return await getDatabase()
  } catch {
    return null
  }
}
