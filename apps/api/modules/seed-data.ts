import type { AnalyticsEventName } from './analytics/types.js'
import type { CanonicalCategory } from './catalog/types.js'
import type { RecommendationCard } from './recommendations/types.js'

const now = new Date().toISOString()

export type SeedCategory = CanonicalCategory & {
  groupFriendly: boolean
  moods: string[]
}

export type SeedRecommendation = RecommendationCard & {
  groupFriendly: boolean
  moods: string[]
}

export const seedCategories: SeedCategory[] = [
  {
    netflixCode: '1365',
    slug: 'action-adventure',
    title: 'Action and Adventure',
    summary: 'Big-energy films for nights when browsing needs to end quickly.',
    tags: ['action', 'fast-paced', 'group-friendly'],
    regions: ['US', 'UK', 'NG'],
    regionSignal: 'best-effort',
    sourceRecordIds: ['seed-action-adventure'],
    createdAt: now,
    updatedAt: now,
    groupFriendly: true,
    moods: ['action', 'fast-paced', 'adrenaline'],
  },
  {
    netflixCode: '8711',
    slug: 'thrillers',
    title: 'Thrillers',
    summary: 'High-tension picks when you want something gripping without guesswork.',
    tags: ['thriller', 'tense', 'date-night'],
    regions: ['US', 'UK'],
    regionSignal: 'best-effort',
    sourceRecordIds: ['seed-thrillers'],
    createdAt: now,
    updatedAt: now,
    groupFriendly: false,
    moods: ['tense', 'thriller', 'dark'],
  },
  {
    netflixCode: '7424',
    slug: 'anime',
    title: 'Anime',
    summary: 'A focused entry point for viewers chasing standout anime finds.',
    tags: ['anime', 'stylized', 'fandom'],
    regions: ['NG'],
    regionSignal: 'best-effort',
    sourceRecordIds: ['seed-anime'],
    createdAt: now,
    updatedAt: now,
    groupFriendly: false,
    moods: ['anime', 'stylized', 'escapist'],
  },
  {
    netflixCode: '783',
    slug: 'children-family-movies',
    title: 'Children and Family Movies',
    summary: 'Safer family-first choices when a group needs an easier yes.',
    tags: ['family', 'group-friendly', 'weekend'],
    regions: ['US', 'NG'],
    regionSignal: 'best-effort',
    sourceRecordIds: ['seed-family'],
    createdAt: now,
    updatedAt: now,
    groupFriendly: true,
    moods: ['cozy', 'family', 'easy'],
  },
]

export const seedRecommendations: SeedRecommendation[] = [
  {
    categoryCode: '8711',
    title: 'Thrillers for a no-scroll movie night',
    reason: 'editorial',
    confidenceLabel: 'high',
    regions: ['US', 'UK'],
    regionSignal: 'best-effort',
    groupFriendly: false,
    moods: ['tense', 'thriller', 'dark'],
  },
  {
    categoryCode: '783',
    title: 'Family picks everyone can agree on',
    reason: 'group-fit',
    confidenceLabel: 'high',
    regions: ['US', 'NG'],
    regionSignal: 'best-effort',
    groupFriendly: true,
    moods: ['family', 'cozy', 'easy'],
  },
  {
    categoryCode: '1365',
    title: 'Fast, high-energy action tonight',
    reason: 'mood-match',
    confidenceLabel: 'medium',
    regions: ['US', 'UK', 'NG'],
    regionSignal: 'best-effort',
    groupFriendly: true,
    moods: ['action', 'fast-paced', 'adrenaline'],
  },
  {
    categoryCode: '7424',
    title: 'Anime when you want something more stylized',
    reason: 'region-match',
    confidenceLabel: 'emerging',
    regions: ['NG'],
    regionSignal: 'best-effort',
    groupFriendly: false,
    moods: ['anime', 'stylized', 'escapist'],
  },
]

export const supportedAnalyticsEvents: AnalyticsEventName[] = [
  'page_view',
  'search_submitted',
  'code_copied',
  'open_in_netflix_clicked',
  'recommendation_selected',
]
