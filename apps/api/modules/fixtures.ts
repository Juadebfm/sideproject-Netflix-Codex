import type { AnalyticsEventName } from './analytics/types.js'
import type { CanonicalCategory } from './catalog/types.js'
import type { RecommendationCard } from './recommendations/types.js'

const now = new Date().toISOString()

export const mockCategories: CanonicalCategory[] = [
  {
    netflixCode: '1365',
    slug: 'action-adventure',
    title: 'Action and Adventure',
    summary: 'Big-energy films for nights when browsing needs to end quickly.',
    tags: ['action', 'fast-paced', 'group-friendly'],
    sourceRecordIds: ['seed-action-adventure'],
    createdAt: now,
    updatedAt: now,
  },
  {
    netflixCode: '8711',
    slug: 'thrillers',
    title: 'Thrillers',
    summary: 'High-tension picks when you want something gripping without guesswork.',
    tags: ['thriller', 'tense', 'date-night'],
    sourceRecordIds: ['seed-thrillers'],
    createdAt: now,
    updatedAt: now,
  },
  {
    netflixCode: '7424',
    slug: 'anime',
    title: 'Anime',
    summary: 'A focused entry point for viewers chasing standout anime finds.',
    tags: ['anime', 'stylized', 'fandom'],
    sourceRecordIds: ['seed-anime'],
    createdAt: now,
    updatedAt: now,
  },
  {
    netflixCode: '783',
    slug: 'children-family-movies',
    title: 'Children and Family Movies',
    summary: 'Safer family-first choices when a group needs an easier yes.',
    tags: ['family', 'group-friendly', 'weekend'],
    sourceRecordIds: ['seed-family'],
    createdAt: now,
    updatedAt: now,
  },
]

export const mockRecommendations: RecommendationCard[] = [
  {
    categoryCode: '8711',
    title: 'Thrillers for a no-scroll movie night',
    reason: 'editorial',
    confidenceLabel: 'high',
  },
  {
    categoryCode: '783',
    title: 'Family picks everyone can agree on',
    reason: 'group-fit',
    confidenceLabel: 'high',
  },
  {
    categoryCode: '1365',
    title: 'Fast, high-energy action tonight',
    reason: 'mood-match',
    confidenceLabel: 'medium',
  },
]

export const supportedAnalyticsEvents: AnalyticsEventName[] = [
  'page_view',
  'search_submitted',
  'code_copied',
  'open_in_netflix_clicked',
  'recommendation_selected',
]
