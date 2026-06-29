import assert from 'node:assert/strict'
import test from 'node:test'

import {
  mergeCanonicalCategories,
  netflixCodesSource,
  prepareStarterCatalogSnapshot,
  starterCatalogSource,
  teenVogueSource,
} from './service.js'
import { prepareNetflixCodesSnapshotFromHtml } from './netflix-codes-source.js'
import { prepareTeenVogueSnapshotFromHtml } from './teen-vogue-source.js'

test('prepareStarterCatalogSnapshot builds raw and canonical records with provenance', () => {
  const snapshot = prepareStarterCatalogSnapshot(starterCatalogSource, '2026-06-29T00:00:00.000Z')

  assert.equal(snapshot.rawRecords.length, 8)
  assert.equal(snapshot.canonicalCategories.length, 4)
  assert.equal(snapshot.curatedRecommendations.length, 4)

  for (const category of snapshot.canonicalCategories) {
    assert.equal(category.sourceRecordIds.length, 1)
    assert.equal(category.createdAt, '2026-06-29T00:00:00.000Z')
  }

  for (const recommendation of snapshot.curatedRecommendations) {
    assert.equal(recommendation.sourceRecordIds.length, 1)
    assert.equal(recommendation.updatedAt, '2026-06-29T00:00:00.000Z')
  }
})

test('prepareNetflixCodesSnapshotFromHtml parses parent and child category codes', () => {
  const html = `
    <html>
      <body>
        <script id="__NEXT_DATA__" type="application/json">
          {"props":{"pageProps":{"data":[{"id":"1","code":1365,"name":{"en":"Action & adventure"},"childCodes":[{"code":43040,"name":{"en":"Action comedies"}}]}]}}}
        </script>
      </body>
    </html>
  `

  const snapshot = prepareNetflixCodesSnapshotFromHtml(
    html,
    netflixCodesSource,
    '2026-06-29T00:00:00.000Z',
  )

  assert.equal(snapshot.rawRecords.length, 2)
  assert.equal(snapshot.canonicalCategories.length, 2)
  assert.equal(snapshot.canonicalCategories[0].sourcePriority, netflixCodesSource.priority)
  assert.equal(snapshot.canonicalCategories[1].title, 'Action comedies')
})

test('prepareTeenVogueSnapshotFromHtml parses code lines from articleBody JSON-LD', () => {
  const html = `
    <html>
      <head>
        <script type="application/ld+json">
          {"@context":"http://schema.org","@type":"NewsArticle","articleBody":"Intro line\\nAction & Adventure (1365)\\nRomantic Comedies (5475)\\nZombie Horror Movies (75405)\\nRelated: ignored"}
        </script>
      </head>
    </html>
  `

  const snapshot = prepareTeenVogueSnapshotFromHtml(
    html,
    teenVogueSource,
    '2026-06-29T00:00:00.000Z',
  )

  assert.equal(snapshot.rawRecords.length, 3)
  assert.equal(snapshot.canonicalCategories.length, 3)
  assert.equal(snapshot.canonicalCategories[1].netflixCode, '5475')
  assert.equal(snapshot.canonicalCategories[2].title, 'Zombie Horror Movies')
})

test('mergeCanonicalCategories keeps higher-priority records and unions provenance', () => {
  const starterSnapshot = prepareStarterCatalogSnapshot(
    starterCatalogSource,
    '2026-06-29T00:00:00.000Z',
  )
  const remoteSnapshot = prepareNetflixCodesSnapshotFromHtml(
    `
      <html>
        <body>
          <script id="__NEXT_DATA__" type="application/json">
            {"props":{"pageProps":{"data":[{"id":"1","code":1365,"name":{"en":"Action & adventure"},"childCodes":[{"code":43040,"name":{"en":"Action comedies"}}]}]}}}
          </script>
        </body>
      </html>
    `,
    netflixCodesSource,
    '2026-06-29T01:00:00.000Z',
  )

  const merged = mergeCanonicalCategories([
    ...starterSnapshot.canonicalCategories,
    ...remoteSnapshot.canonicalCategories,
  ])

  const actionCategory = merged.find((category) => category.netflixCode === '1365')

  assert.ok(actionCategory)
  assert.equal(
    actionCategory.summary,
    'Big-energy films for nights when browsing needs to end quickly.',
  )
  assert.equal(actionCategory.sourceRecordIds.length, 2)
  assert.ok(
    merged.some((category) => category.netflixCode === '43040' && category.title === 'Action comedies'),
  )
})
