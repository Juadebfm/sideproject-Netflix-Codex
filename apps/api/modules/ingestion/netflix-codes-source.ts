import { ObjectId } from 'mongodb'

import type {
  IngestionSource,
  PreparedCanonicalCategoryCandidate,
  PreparedRawSourceRecord,
  PreparedSourceSnapshot,
  RawSourceRecord,
} from './types.js'

type NetflixCodesName = {
  en?: string
  es?: string
  fr?: string
}

type NetflixCodesChildCode = {
  code: number | null
  name: NetflixCodesName
}

type NetflixCodesCategory = {
  id: string
  code: number | null
  name: NetflixCodesName
  childCodes?: NetflixCodesChildCode[]
}

type NetflixCodesPayload = {
  props?: {
    pageProps?: {
      data?: NetflixCodesCategory[]
    }
  }
}

function buildRawSourceRecord(
  source: IngestionSource,
  recordType: RawSourceRecord['recordType'],
  fetchedAt: string,
  payload: Record<string, unknown>,
): PreparedRawSourceRecord {
  return {
    _id: new ObjectId().toHexString(),
    sourceId: source.id,
    sourceLabel: source.label,
    sourceVersion: source.version,
    recordType,
    fetchedAt,
    payload,
  }
}

function getLocalizedName(name: NetflixCodesName) {
  return name.en?.trim() || name.es?.trim() || name.fr?.trim() || 'Unknown category'
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function buildTags(...values: string[]) {
  return Array.from(
    new Set(
      values
        .flatMap((value) => value.toLowerCase().split(/[^a-z0-9]+/))
        .map((token) => token.trim())
        .filter((token) => token.length >= 3),
    ),
  ).slice(0, 8)
}

function buildCategoryCandidate(input: {
  source: IngestionSource
  sourceRecordId: string
  timestamp: string
  code: string
  title: string
  summary: string
  tags: string[]
}): PreparedCanonicalCategoryCandidate {
  const { source, sourceRecordId, timestamp, code, title, summary, tags } = input

  return {
    netflixCode: code,
    slug: slugify(title),
    title,
    summary,
    tags,
    regions: [],
    regionSignal: 'best-effort' as const,
    sourceRecordIds: [sourceRecordId],
    createdAt: timestamp,
    updatedAt: timestamp,
    sourceId: source.id,
    sourcePriority: source.priority,
  }
}

export function prepareNetflixCodesSnapshotFromHtml(
  html: string,
  source: IngestionSource,
  timestamp: string = new Date().toISOString(),
): PreparedSourceSnapshot {
  const nextDataMatch = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/,
  )

  if (!nextDataMatch) {
    throw new Error('Netflix-Codes payload was not found in the source HTML')
  }

  const payload = JSON.parse(nextDataMatch[1]) as NetflixCodesPayload
  const categories = payload.props?.pageProps?.data

  if (!Array.isArray(categories)) {
    throw new Error('Netflix-Codes payload did not include category data')
  }

  const rawRecords: PreparedRawSourceRecord[] = []
  const canonicalCategories: PreparedCanonicalCategoryCandidate[] = []

  for (const category of categories) {
    const parentTitle = getLocalizedName(category.name)

    if (category.code !== null) {
      const parentRawRecord = buildRawSourceRecord(source, 'category', timestamp, {
        kind: 'parent',
        code: category.code,
        title: parentTitle,
      })

      rawRecords.push(parentRawRecord)
      canonicalCategories.push(
        buildCategoryCandidate({
          source,
          sourceRecordId: parentRawRecord._id,
          timestamp,
          code: String(category.code),
          title: parentTitle,
          summary: `Imported from ${source.label}.`,
          tags: buildTags(parentTitle),
        }),
      )
    }

    for (const childCode of category.childCodes ?? []) {
      if (childCode.code === null) {
        continue
      }

      const childTitle = getLocalizedName(childCode.name)
      const childRawRecord = buildRawSourceRecord(source, 'category', timestamp, {
        kind: 'child',
        code: childCode.code,
        title: childTitle,
        parentCode: category.code,
        parentTitle,
      })

      rawRecords.push(childRawRecord)
      canonicalCategories.push(
        buildCategoryCandidate({
          source,
          sourceRecordId: childRawRecord._id,
          timestamp,
          code: String(childCode.code),
          title: childTitle,
          summary: `Imported from ${source.label} under ${parentTitle}.`,
          tags: buildTags(childTitle, parentTitle),
        }),
      )
    }
  }

  return {
    rawRecords,
    canonicalCategories,
    curatedRecommendations: [],
  }
}

export async function fetchNetflixCodesSnapshot(
  source: IngestionSource,
  timestamp: string = new Date().toISOString(),
): Promise<PreparedSourceSnapshot> {
  if (!source.fetchUrl) {
    throw new Error(`Source ${source.id} is missing a fetch URL`)
  }

  const response = await fetch(source.fetchUrl, {
    headers: {
      'User-Agent': 'NetflixCodexBot/1.0 (+https://netflix-codex-web.vercel.app)',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${source.label}: ${response.status}`)
  }

  const html = await response.text()
  return prepareNetflixCodesSnapshotFromHtml(html, source, timestamp)
}
