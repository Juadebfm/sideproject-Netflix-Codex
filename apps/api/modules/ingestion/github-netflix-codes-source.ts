import { ObjectId } from 'mongodb'

import type {
  IngestionSource,
  PreparedCanonicalCategoryCandidate,
  PreparedRawSourceRecord,
  PreparedSourceSnapshot,
  RawSourceRecord,
} from './types.js'

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
}): PreparedCanonicalCategoryCandidate {
  const { source, sourceRecordId, timestamp, code, title } = input

  return {
    netflixCode: code,
    slug: slugify(title),
    title,
    tags: buildTags(title),
    regions: [],
    regionSignal: 'best-effort',
    sourceRecordIds: [sourceRecordId],
    sourceLabels: [source.label],
    titleSourceLabel: source.label,
    verificationState: source.kind === 'local-starter' ? 'manual-curated' : 'source-backed',
    createdAt: timestamp,
    updatedAt: timestamp,
    sourceId: source.id,
    sourcePriority: source.priority,
  }
}

export function prepareGithubNetflixCodesSnapshotFromMarkdown(
  markdown: string,
  source: IngestionSource,
  timestamp: string = new Date().toISOString(),
): PreparedSourceSnapshot {
  const rawRecords: PreparedRawSourceRecord[] = []
  const canonicalCategories: PreparedCanonicalCategoryCandidate[] = []
  const seenCodes = new Set<string>()
  const linePattern =
    /^\s*-\s+\*\*(?<title>.+?)\*\*\s+-\s+\[(?<code>\d+)\]\(https:\/\/www\.netflix\.com\/browse\/genre\/\d+\)\s*$/

  for (const rawLine of markdown.split('\n')) {
    const line = rawLine.trim()
    const match = line.match(linePattern)

    if (!match?.groups) {
      continue
    }

    const title = match.groups.title.trim()
    const code = match.groups.code.trim()

    if (seenCodes.has(code)) {
      continue
    }

    seenCodes.add(code)
    const rawRecord = buildRawSourceRecord(source, 'category', timestamp, {
      title,
      code,
      markdownLine: line,
    })

    rawRecords.push(rawRecord)
    canonicalCategories.push(
      buildCategoryCandidate({
        source,
        sourceRecordId: rawRecord._id,
        timestamp,
        code,
        title,
      }),
    )
  }

  if (rawRecords.length === 0) {
    throw new Error('GitHub Netflix-Codes README did not include any parseable code lines')
  }

  return {
    rawRecords,
    canonicalCategories,
    curatedRecommendations: [],
  }
}

export async function fetchGithubNetflixCodesSnapshot(
  source: IngestionSource,
  timestamp: string = new Date().toISOString(),
): Promise<PreparedSourceSnapshot> {
  if (!source.fetchUrl) {
    throw new Error(`Source ${source.id} is missing a fetch URL`)
  }

  const response = await fetch(source.fetchUrl, {
    headers: {
      'User-Agent': 'NetflixCodexBot/1.0 (+https://netflix-codex-web.vercel.app)',
      Accept: 'text/plain, text/markdown;q=0.9, */*;q=0.8',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${source.label}: ${response.status}`)
  }

  const markdown = await response.text()
  return prepareGithubNetflixCodesSnapshotFromMarkdown(markdown, source, timestamp)
}
