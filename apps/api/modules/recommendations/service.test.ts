import assert from 'node:assert/strict'
import test from 'node:test'

import { prepareStarterCatalogSnapshot, starterCatalogSource } from '../ingestion/service.js'
import { buildRecommendationResult } from './service.js'

test('buildRecommendationResult returns exact region matches when available', () => {
  const snapshot = prepareStarterCatalogSnapshot(starterCatalogSource, '2026-06-29T00:00:00.000Z')
  const result = buildRecommendationResult(snapshot.curatedRecommendations, {
    region: 'ng',
  })

  assert.equal(result.meta.requestedRegion, 'NG')
  assert.equal(result.meta.appliedRegion, 'NG')
  assert.equal(result.meta.regionFallback, false)
  assert.equal(result.recommendations.length, 3)
})

test('buildRecommendationResult returns broader results when region has no matches', () => {
  const snapshot = prepareStarterCatalogSnapshot(starterCatalogSource, '2026-06-29T00:00:00.000Z')
  const result = buildRecommendationResult(snapshot.curatedRecommendations, {
    region: 'CA',
    groupFriendly: true,
  })

  assert.equal(result.meta.requestedRegion, 'CA')
  assert.equal(result.meta.appliedRegion, null)
  assert.equal(result.meta.regionFallback, true)
  assert.equal(result.recommendations.length, 2)
  assert.deepEqual(result.meta.availableRegions, ['NG', 'UK', 'US'])
})
