import { z } from 'zod'

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  MONGODB_DB_NAME: z.string().min(1, 'MONGODB_DB_NAME is required'),
  CRON_SECRET: z.string().min(1).optional(),
})

export type ServerEnv = z.output<typeof serverEnvSchema>

export function safeReadServerEnv(rawEnv: NodeJS.ProcessEnv = process.env) {
  return serverEnvSchema.safeParse({
    NODE_ENV: rawEnv.NODE_ENV,
    MONGODB_URI: rawEnv.MONGODB_URI,
    MONGODB_DB_NAME: rawEnv.MONGODB_DB_NAME,
    CRON_SECRET: rawEnv.CRON_SECRET,
  })
}

export function readServerEnv(rawEnv: NodeJS.ProcessEnv = process.env): ServerEnv {
  const parsed = safeReadServerEnv(rawEnv)

  if (!parsed.success) {
    throw new Error(
      `Invalid server environment: ${parsed.error.issues
        .map((issue) => issue.message)
        .join(', ')}`,
    )
  }

  return parsed.data
}
