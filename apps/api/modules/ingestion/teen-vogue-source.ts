import { ObjectId } from 'mongodb'

import type {
  IngestionSource,
  PreparedCanonicalCategoryCandidate,
  PreparedRawSourceRecord,
  PreparedSourceSnapshot,
} from './types.js'

type JsonLdNewsArticle = {
  '@type'?: string | string[]
  articleBody?: string
}

function buildRawSourceRecord(
  source: IngestionSource,
  fetchedAt: string,
  payload: Record<string, unknown>,
): PreparedRawSourceRecord {
  return {
    _id: new ObjectId().toHexString(),
    sourceId: source.id,
    sourceLabel: source.label,
    sourceVersion: source.version,
    recordType: 'category',
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

function parseJsonLdScripts(html: string) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((match) => match[1])
    .flatMap((payload) => {
      try {
        const parsed = JSON.parse(payload) as JsonLdNewsArticle | JsonLdNewsArticle[]
        return Array.isArray(parsed) ? parsed : [parsed]
      } catch {
        return []
      }
    })
}

function findArticleBody(html: string) {
  const article = parseJsonLdScripts(html).find((candidate) => {
    const types = Array.isArray(candidate['@type']) ? candidate['@type'] : [candidate['@type']]
    return types.includes('NewsArticle') && typeof candidate.articleBody === 'string'
  })

  if (!article?.articleBody) {
    throw new Error('Teen Vogue articleBody payload was not found in the source HTML')
  }

  return article.articleBody
}

export function prepareTeenVogueSnapshotFromHtml(
  html: string,
  source: IngestionSource,
  timestamp: string = new Date().toISOString(),
): PreparedSourceSnapshot {
  const articleBody = findArticleBody(html)
  const rawRecords: PreparedRawSourceRecord[] = []
  const canonicalCategories: PreparedCanonicalCategoryCandidate[] = []
  const seenLines = new Set<string>()
  const linePattern = /^(?<title>.+?)\s*\((?<code>\d{2,})\)$/

  for (const rawLine of articleBody.split('\n')) {
    const line = rawLine.trim()
    const match = line.match(linePattern)

    if (!match?.groups) {
      continue
    }

    const title = match.groups.title.trim()
    const code = match.groups.code.trim()
    const seenKey = `${title}:${code}`

    if (seenLines.has(seenKey)) {
      continue
    }

    seenLines.add(seenKey)
    const rawRecord = buildRawSourceRecord(source, timestamp, {
      title,
      code,
      articleLine: line,
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
    throw new Error('Teen Vogue source did not include any parseable code lines')
  }

  return {
    rawRecords,
    canonicalCategories,
    curatedRecommendations: [],
  }
}

export async function fetchTeenVogueSnapshot(
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
  return prepareTeenVogueSnapshotFromHtml(html, source, timestamp)
}
