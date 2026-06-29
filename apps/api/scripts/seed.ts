import { getRequiredDatabase } from '../lib/runtime.js'
import { runConfiguredCatalogIngestion } from '../modules/ingestion/index.js'

const db = await getRequiredDatabase()
const runs = await runConfiguredCatalogIngestion(db)

console.log(
  JSON.stringify(
    {
      ok: true,
      runs,
    },
    null,
    2,
  ),
)
