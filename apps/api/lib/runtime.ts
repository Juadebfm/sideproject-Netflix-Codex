import { safeReadServerEnv } from './env.js'
import { getDatabase } from './mongodb.js'

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
